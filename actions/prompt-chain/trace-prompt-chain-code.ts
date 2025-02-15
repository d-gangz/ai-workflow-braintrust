"use server";

import { google } from "@ai-sdk/google";
// import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { traced } from "braintrust";
import { OUTLINE_PROMPT, STORY_GENERATION_PROMPT } from "./prompts";

// mainly use a reusable LLM response generator. Then used the .replace() method to replace the placeholder with the output of the previous step.

// Reusable LLM response generator with extended metric logging
async function generateLLMResponse(prompt: string): Promise<string> {
  return await traced(
    async (span) => {
      span.log({ input: prompt });

      // Call the LLM using generateText, which returns text along with metrics like usage and latency.
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

      // Log extended metrics if available.
      span.log({
        output: result.text,
        // metrics: {
        //   prompt_tokens: result.usage?.promptTokens,
        //   completion_tokens: result.usage?.completionTokens,
        //   total_tokens: result.usage?.totalTokens,
        // },
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

export async function promptChain(input: string): Promise<PromptChainResult> {
  return await traced(
    async (span) => {
      span.log({ input: input });

      // Step 1: Generate outline using the input sentence.
      const outline = await generateLLMResponse(
        OUTLINE_PROMPT.replace("{{input_sentence}}", input)
      );

      // Step 2: Generate the final story using the generated outline.
      const story = await generateLLMResponse(
        STORY_GENERATION_PROMPT.replace("{{plot_outline}}", outline)
      );

      const result = { outline, story };
      span.log({ output: { outline: outline, story: story } });
      return result;
    },
    { name: "prompt chain", type: "function" }
  );
}
