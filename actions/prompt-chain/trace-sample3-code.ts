"use server";

import { traced } from "braintrust";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { OUTLINE_PROMPT, STORY_GENERATION_PROMPT } from "./prompts";

// This nested function performs part of the task and will have its own trace span.
async function generateLLMResponse(prompt: string): Promise<string> {
  return await traced(
    async (span) => {
      // Log the start of the nested function.
      span.log({ input: prompt });

      const result = await generateText({
        model: google("gemini-2.0-flash-001"),
        // model: openai("gpt-4o-mini"),
        prompt,
        // experimental_telemetry: {
        //   isEnabled: true,
        //   functionId: "generateLLMResponse",
        //   metadata: {
        //     model: "gemini-2.0-flash-001",
        //     model_type: "text generation",
        //   },
        // },
      });

      // Log the result of the nested function.
      span.log({
        output: result.text,
        metrics: {
          prompt_tokens: result.usage?.promptTokens,
          completion_tokens: result.usage?.completionTokens,
          total_tokens: result.usage?.totalTokens,
        },
      });
      return result.text;
    },
    { name: "LLM Call", type: "llm" }
  );
}

export type PromptChainResult = {
  outline: string;
  story: string;
};
// The main task function, which includes a call to the nested function.
export async function promptChain(input: string): Promise<PromptChainResult> {
  return await traced(
    async (span) => {
      // Log the beginning of the main task.
      span.log({ input: input });

      // Call the nested function – its trace will appear as a child span.
      const outline = await generateLLMResponse(
        OUTLINE_PROMPT.replace("{{input_sentence}}", input)
      );
      const story = await generateLLMResponse(
        STORY_GENERATION_PROMPT.replace("{{plot_outline}}", outline)
      );

      // Log the completion of the main task.
      span.log({ output: { outline: outline, story: story } });
      return { outline: outline, story: story };
    },
    { name: "Prompt Chain", type: "function" }
  );
}
