"use server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { Eval } from "braintrust";

async function main(input: string) {
  const result = await generateText({
    model: google("gemini-2.0-flash-001"),
    prompt: `What is 2 + ${input}?`,
    experimental_telemetry: {
      isEnabled: true,
      metadata: {
        query: "weather",
        location: "San Francisco",
      },
    },
  });

  return result;
}

const inputData = [{ input: "2" }, { input: "3" }];

Eval("ai-workflow", {
  experimentName: "trace-aisdk",
  data: () => inputData,
  task: async (input) => {
    return await main(input);
  },
  scores: [],
});
