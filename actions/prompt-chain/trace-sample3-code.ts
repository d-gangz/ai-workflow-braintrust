import { traced } from "braintrust";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const promptstart = "use {{input}} as a character in a single sentence story";
const promptend = "use {{promptstart}} to create a single sentence ending";
// This nested function performs part of the task and will have its own trace span.
async function nestedFunction(prompt: string): Promise<string> {
  return await traced(
    async (span) => {
      // Log the start of the nested function.
      span.log({ input: prompt });

      // Simulate some nested processing (for example, an LLM call or computation)
      // const result = `Nested processed: ${input}`;

      const result = await generateText({
        model: google("gemini-2.0-flash-001"),
        // model: openai("gpt-4o-mini"),
        prompt,
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
    { name: "nestedFunction", type: "llm" }
  );
}

export type PromptChainResult = {
  result1: string;
  result2: string;
};
// The main task function, which includes a call to the nested function.
export async function taskFunction(input: string): Promise<PromptChainResult> {
  return await traced(
    async (span) => {
      // Log the beginning of the main task.
      span.log({ input: input });

      // Call the nested function – its trace will appear as a child span.
      const nestedResult = await nestedFunction(
        promptstart.replace("{{input}}", input)
      );
      const nestedResult2 = await nestedFunction(
        promptend.replace("{{promptstart}}", nestedResult)
      );

      // Log the completion of the main task.
      span.log({ output: { result1: nestedResult, result2: nestedResult2 } });
      return { result1: nestedResult, result2: nestedResult2 };
    },
    { name: "taskFunction", type: "function" }
  );
}
