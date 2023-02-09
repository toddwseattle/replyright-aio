import { describe, expect, it } from "@jest/globals";
import { ReplyRightSuggestion } from ".";
import { EmailAddress } from "../shared/imessage";

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
    expect(rrs.message.from).toStrictEqual({ displayName: "", emailAddress: "" });
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
  describe("buildPromptFromMessage", () => {
    let object: ReplyRightSuggestion;

    beforeEach(() => {
      object = new ReplyRightSuggestion({ body: "" });
      object.getSubMessagePositions = jest.fn().mockReturnValue([0, 100]);
    });

    it("sets errorState when message is undefined", () => {
      object.message = undefined;
      object.buildPromptFromMessage();
      expect(object.errorState).toEqual({
        hasError: true,
        message: "enter some context or the start of a message to generate a reply",
      });
    });

    it("sets errorState when message body is undefined", () => {
      object.message.body = undefined;
      object.buildPromptFromMessage();
      expect(object.errorState).toEqual({
        hasError: true,
        message: "enter some context or the start of a message to generate a reply",
      });
    });

    it("sets replyPrompt to substring of message body when subMessages has 1 element", () => {
      const messageBody = " this is an message ".repeat(5);
      object.message.body = messageBody;
      object.getSubMessagePositions.mockReturnValue([100]);
      object.buildPromptFromMessage();
      expect(object.replyPrompt).toBe(object.message.body.substring(0, 100));
    });

    it("limits the message body to 4000 characters or less", () => {
      object.message.body = "a".repeat(5000);
      object.buildPromptFromMessage();
      expect(object.message.body.length).toBeLessThanOrEqual(4000);
    });

    it("sets replyPrompt to the first message part when subMessages has multiple elements and exceeds 4000 characters", () => {
      object.message.body = " this is an message ".repeat(220);
      const replyPromptShouldBe = object.message.body.substring(0, 100);
      object.getSubMessagePositions.mockReturnValue([100, 200, 300]);
      object.buildPromptFromMessage();
      expect(object.replyPrompt).toBe(replyPromptShouldBe);
    });
  });
});
