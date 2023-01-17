import { describe, expect, it } from "@jest/globals";
import { EmailAddress, ReplyRightSuggestion } from ".";

describe("ReplyRightSuggestion", () => {
  it("should create a an object and the constructor should initialize the message member", () => {
    const rrs = new ReplyRightSuggestion();
    expect(rrs.message).toBeDefined();
  });
  it("should have a messages member with default values initialized", () => {
    const rrs = new ReplyRightSuggestion();
    const emptyEmails: EmailAddress[] = [];
    expect(rrs.message.isReply).toBe(false);
    expect(rrs.message.to).toStrictEqual(emptyEmails);
    expect(rrs.message.bcc).toStrictEqual(emptyEmails);
    expect(rrs.message.cc).toStrictEqual(emptyEmails);
    expect(rrs.message.from).toStrictEqual({ displayname: "", address: "" });
    expect(rrs.message.body).toBe("");
  });
  it("should set the subject in the constructor if passed", () => {
    const rrs = new ReplyRightSuggestion({ subject: "test subject" });
    expect(rrs.message.subject).toBe("test subject");
  });
  it("should set is reply if subject starts with RE: and has a body", () => {
    const rrs = new ReplyRightSuggestion({
      subject: "RE: this is a reply to a message",
      body: "hey can your reply to this?",
    });

    expect(rrs.message.isReply).toBeTruthy();
  });
  it("should not set reply if the subject doesnt start with RE", () => {
    const rrs = new ReplyRightSuggestion({ subject: "this not a RE: ply", body: "not a replay" });
    expect(rrs.message.isReply).toBeFalsy();
  });
});
