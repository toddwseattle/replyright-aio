/// <reference types="jest" />

import { ReplyRightSuggestion } from ".";

describe("ReplyRightSuggestion", () => {
  it("should create a an object and the constructor should initialize the message member", () => {
    const rrs = new ReplyRightSuggestion();
    rrs.message;
  });
});
