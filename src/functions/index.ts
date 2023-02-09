// import { ChoiceGroup } from "@fluentui/react";
import { CreateCompletionResponseChoicesInner } from "openai";
import { ReplyRightSuggestion } from "../message";

const LOCAL = false;
const LocalReplyUrl = "http://localhost:7071/api/getGPT3?";
const ProductReplyUrl =
  "https://replyright-ai-1.azurewebsites.net/api/getgpt3?code=OjY2sPgsqOw-HK-wpHcfFXBhRFz9Z3oBEAavh5LINVE_AzFus3Ke3g%3D%3D";
const replyFunction = LOCAL ? LocalReplyUrl : ProductReplyUrl;
export async function getSuggestionChoices(
  suggestion: ReplyRightSuggestion
): Promise<CreateCompletionResponseChoicesInner[]> {
  try {
    const init: RequestInit = {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      // mode: "cors",
      body: JSON.stringify(suggestion),
    };
    // eslint-disable-next-line no-undef
    const result = await fetch(replyFunction + "&action=reply", init);
    if (!result.ok) {
      return [];
    } else {
      const choices = await result.json();
      if (choices.status == "success" && choices.choices) {
        return choices.choices;
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-undef
    console.log(error);
    return [];
  }
  return [];
}
