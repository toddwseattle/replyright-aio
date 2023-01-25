/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

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
  const suggestion = new ReplyRightSuggestion();

  try {
    await suggestion.initializeFromItem(item);
    suggestion.buildPromptFromMessage();
    if (suggestion.errorState.hasError) {
      message.message = `error ${suggestion.errorState.message} `;
      Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
    } else {
      message.message = `will create response based on ${suggestion.replyPrompt.length} character prompt`;
      Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
    }
    event.completed();
  } catch (error) {
    message.message = "error:" + error.message;
    Office.context.mailbox.item.notificationMessages.replaceAsync("action", message);
    event.completed();
  }

  // Be sure to indicate when the add-in command function is complete
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
