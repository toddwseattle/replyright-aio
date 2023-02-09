/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import { getSuggestionChoices } from "../functions";
import { ReplyRightSuggestion } from "../message";

/* global global, Office, self, window */

Office.onReady(() => {
  // If needed, Office.js is ready to be called
});

/**
 * Shows a notification when the add-in command is executed.
 * @param event
 */
async function action(event: Office.AddinCommands.Event) {
  const message: Office.NotificationMessageDetails = {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: "Performed action.",
    icon: "Icon.80x80",
    persistent: true,
  };

  const item = Office.context.mailbox.item;
  if (Office.context.mailbox.item) {
    const suggestion = new ReplyRightSuggestion();

    try {
      await suggestion.initializeFromItem(item as Office.MessageCompose);
      suggestion.buildPromptFromMessage();
      if (suggestion.errorState.hasError && Office.context.mailbox.item) {
        message.message = `error ${suggestion.errorState.message} `;
        Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
      } else {
        message.message = `calling create response based on ${suggestion.replyPrompt.length} character prompt`;
        Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
        const choices = await getSuggestionChoices(suggestion);
        if (choices[0] && choices[0].text) {
          message.message = `have generate ${choices.length} choices`;
          Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
          try {
            const choice0message = JSON.parse(choices[0].text).body;
            Office.context.mailbox.item.setSelectedDataAsync(choice0message, { coercionType: "text" });
          } catch (foo) {
            Office.context.mailbox.item.setSelectedDataAsync(choices[0].text, { coercionType: "test" });
          }
        } else {
          message.message = `failed to  generate choices`;
          Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
        }
      }
      event.completed();
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.message = "error:" + error.message;
        Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
      }
      event.completed();
    }

    // Be sure to indicate when the add-in command function is complete
  } else {
    event.completed();
  }
}

function getGlobal() {
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : undefined;
}

const g = getGlobal() as any;

// The add-in command functions need to be available in global scope
g.action = action;
