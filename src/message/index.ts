/* global Office */
import { ProgressIndicatorBase } from "@fluentui/react";
import { getBodyTextPromise, getRecipientsPromise, getSubjectPromise, getFromPromise } from "./itemUtils";

export interface MessageInfo {
  isReply: boolean;
  from: EmailAddress;
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  subject: string;
  body: string;
}

export interface EmailAddress {
  displayName: string;
  emailAddress: string;
}

export class ReplyRightSuggestion {
  public message: MessageInfo;
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
    if (this.message.body.length > 0) this.checkIfReply();
  }
  checkIfReply() {
    this.message.isReply =
      this.message.subject.length >= 3 ? this.message.subject.substring(0, 3).toUpperCase() == "RE:" : false;
  }
  private OfficeEA2EmailAddress(OfficeEmail: Office.EmailAddressDetails): EmailAddress {
    return { emailAddress: OfficeEmail.emailAddress, displayName: OfficeEmail.emailAddress };
  }
  public getSubMessagePositions(): number[] {
    if (this.message.body.length > 0) {
      const fromRX = /From\:/g;
      let indices = [];
      let result: RegExpExecArray;
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
      this.errorState.message = error.message;
    }
  }
}
