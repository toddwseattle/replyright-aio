/* global Office */
/* eslint-disable no-dupe-keys */
import { describe, it, expect, beforeEach } from "@jest/globals";
import { getSubjectPromise } from "./itemUtils";
describe("Item Utility Functions", () => {
  let subjectMock: Office.Subject;
  beforeEach(() => {
    subjectMock = {
      getAsync(options: Office.AsyncContextOptions, callback: (asyncResult: Office.AsyncResult<string>) => void): void {
        callback({
          value: "a subject",
          asyncContext: options,
          diagnostics: undefined,
          error: undefined,
          status: Office.AsyncResultStatus.Succeeded,
        });
      },

      getAsync(callback: (asyncResult: Office.AsyncResult<string>) => void): void {
        callback({
          value: "a subject",
          asyncContext: undefined,
          diagnostics: undefined,
          error: undefined,
          status: Office.AsyncResultStatus.Succeeded,
        });
      },
      setAsync(
        subject: string,
        options: Office.AsyncContextOptions,
        callback?: (asyncResult: Office.AsyncResult<void>) => void
      ): void {
        callback({
          error: undefined,
          asyncContext: options,
          diagnostics: subject,
          status: Office.AsyncResultStatus.Succeeded,
          value: undefined,
        });
      },
      setAsync(subject: string, callback?: (asyncResult: Office.AsyncResult<void>) => void): void {
        {
          callback({
            error: undefined,
            asyncContext: undefined,
            diagnostics: subject,
            status: Office.AsyncResultStatus.Succeeded,
            value: undefined,
          });
        }
      },
    };
  });

  it("should call the subject promise", async () => {
    expect.assertions(1);
    const value = await getSubjectPromise(subjectMock);
    expect(value).toBe("a subject");
  });
});
