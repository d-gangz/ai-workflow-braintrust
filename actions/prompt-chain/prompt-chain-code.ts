"use server";

import { google } from "@ai-sdk/google";
// import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { OUTLINE_PROMPT, STORY_GENERATION_PROMPT } from "./prompts";

// mainly use a reusable LLM response generator. Then used the .replace() method to replace the placeholder with the output of the previous step.

// Reusable LLM response generator
async function generateLLMResponse(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: google("gemini-2.0-flash-001"),
    // model: openai("gpt-4o-mini"),
    prompt,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "generateLLMResponse",
      metadata: {
        model: "gemini-2.0-flash-001",
        model_type: "text generation",
      },
    },
  });
  return text;
}

type PromptChainResult = {
  outline: string;
  story: string;
};

export async function promptChain(input: string): Promise<PromptChainResult> {
  // Step 1: Extract requirements
  const outline = await generateLLMResponse(
    OUTLINE_PROMPT.replace("{{input_sentence}}", input)
  );

  // Step 2: Create screening criteria
  const story = await generateLLMResponse(
    STORY_GENERATION_PROMPT.replace("{{plot_outline}}", outline)
  );

  return {
    outline,
    story,
  };
}
