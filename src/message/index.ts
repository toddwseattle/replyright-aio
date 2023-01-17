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
  displayname: string;
  address: string;
}

export class ReplyRightSuggestion {
  public message: MessageInfo;
  constructor(message?: Partial<MessageInfo>) {
    this.message = {
      isReply: false,
      from: { displayname: "", address: "" },
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
}
