/* global Office */
/***
 * This file promisfies some of the office item async functions
 */

export let getSubjectPromise = (subject: Office.Subject) =>
  new Promise<string>((resolve, reject) => {
    subject.getAsync((subject) => {
      if (subject.status == Office.AsyncResultStatus.Succeeded) {
        resolve(subject.value);
      } else {
        reject(subject.error);
      }
    });
  });

export let getBodyTextPromise = (body: Office.Body) =>
  new Promise<string>((resolve, reject) => {
    body.getAsync("text", (body) => {
      if (body.status == Office.AsyncResultStatus.Succeeded) {
        resolve(body.value);
      } else {
        reject(body.error);
      }
    });
  });
export let getRecipientsPromise = (recipients: Office.Recipients) =>
  new Promise<Office.EmailAddressDetails[]>((resolve, reject) => {
    recipients.getAsync((emailDetails) => {
      if (emailDetails.status == Office.AsyncResultStatus.Succeeded) {
        resolve(emailDetails.value);
      } else {
        reject(emailDetails.error);
      }
    });
  });
export let getFromPromise = (from: Office.From) =>
  new Promise<Office.EmailAddressDetails>((resolve, reject) => {
    from.getAsync((from) => {
      if (from.status == Office.AsyncResultStatus.Succeeded) {
        resolve(from.value);
      } else {
        reject(from.error);
      }
    });
  });
