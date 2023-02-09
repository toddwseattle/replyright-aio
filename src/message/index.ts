/* global Office */
//import { ProgressIndicatorBase } from "@fluentui/react";
import { getBodyTextPromise, getRecipientsPromise, getSubjectPromise, getFromPromise } from "./itemUtils";
import { MessageInfo, EmailAddress, ReplyRightSuggestionData } from "../shared/imessage";

export class ReplyRightSuggestion implements ReplyRightSuggestionData {
  public message: MessageInfo;
  public replyPrompt: string;
  public errorState: { hasError: boolean; message: string };
  constructor(message?: Partial<MessageInfo>) {
    this.message = {
      isReply: false,
      from: { displayName: "", emailAddress: "" },
      to: [],
      cc: [],
      bcc: [],
      subject: "",
      body: "",
      ...message,
    };
    this.replyPrompt = "create a plausible reply to this message";
    this.errorState = { hasError: false, message: "" };
    if (this.message.body.length > 0) this.checkIfReply();
  }
  checkIfReply() {
    this.message.isReply =
      this.message.subject.length >= 3 ? this.message.subject.substring(0, 3).toUpperCase() == "RE:" : false;
  }
  private OfficeEA2EmailAddress(OfficeEmail: Office.EmailAddressDetails): EmailAddress {
    return { emailAddress: OfficeEmail.emailAddress, displayName: OfficeEmail.emailAddress };
  }
  public buildPromptFromMessage(): void {
    const MaxMessageSize = 4000;
    if (!this.message?.body) {
      this.errorState = { hasError: true, message: "enter some context or the start of a message to generate a reply" };
      return;
    }

    const subMessages = this.getSubMessagePositions();
    if (subMessages.length === 0) {
      this.errorState = { hasError: true, message: "enter some context to generate a reply" };
      return;
    }

    this.replyPrompt = this.message.body.substring(0, subMessages[0]);
    if (this.message.body.length > MaxMessageSize) {
      let reply = "";
      switch (subMessages.length) {
        case 1:
          reply = this.message.body.substring(0, MaxMessageSize);
          break;
        case 2:
          const end = Math.min(subMessages[1] + 0.8 * MaxMessageSize, this.message.body.length);
          reply = this.message.body.substring(subMessages[1], end);
          break;
        default:
          reply =
            "most current reply in thread is: " +
            this.message.body.substring(subMessages[1], subMessages[2]).substring(0, MaxMessageSize / 2) +
            "previous reply in thread is: " +
            this.message.body.substring(subMessages[subMessages.length - 1], this.message.body.substring.length);
      }
      this.message.body = reply;
    }
  }
  public getSubMessagePositions(): number[] {
    if (this.message.body.length > 0) {
      const fromRX = /From:/g;
      let indices = [];
      let result: RegExpExecArray | null;
      while ((result = fromRX.exec(this.message.body))) {
        indices.push(result.index);
      }
      return indices;
    } else return [];
  }

  async initializeFromItem(item: Office.MessageCompose) {
    try {
      this.message.subject = await getSubjectPromise(item.subject);
      this.message.body = await getBodyTextPromise(item.body);
      this.message.from = this.OfficeEA2EmailAddress(await getFromPromise(item.from));
      // tbd need to convert using OfficeEA2
      this.message.cc = (await getRecipientsPromise(item.cc)).map((r) => this.OfficeEA2EmailAddress(r));
      this.message.to = (await getRecipientsPromise(item.to)).map((r) => this.OfficeEA2EmailAddress(r));
      this.message.bcc = (await getRecipientsPromise(item.bcc)).map((r) => this.OfficeEA2EmailAddress(r));
      this.checkIfReply();
    } catch (error) {
      this.errorState.hasError = true;
      if (error instanceof Error) {
        this.errorState.message = error.message;
      } else {
        this.errorState.message = "uknown error";
      }
    }
  }
}
