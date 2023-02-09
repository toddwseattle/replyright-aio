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
export interface errorStateData {
  hasError: boolean;
  message: string;
}
export interface ReplyRightSuggestionData {
  message: MessageInfo;
  replyPrompt: string;
  errorState: errorStateData;
}
