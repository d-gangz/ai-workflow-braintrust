// ok this worksss!!! so gotta use the currentSpan() to log the input and output of the function. wait actually the span.log works with the traced function.

import { Eval, traced, currentSpan } from "braintrust";

// This nested function performs part of the task and will have its own trace span.
async function nestedFunction(input: string): Promise<string> {
  return await traced(
    async () => {
      // Log the start of the nested function.
      currentSpan().log({ input: input });

      // Simulate some nested processing (for example, an LLM call or computation)
      const result = `Nested processed: ${input}`;

      // Log the result of the nested function.
      currentSpan().log({ output: result });
      return result;
    },
    { name: "nestedFunction", type: "llm" }
  );
}

// The main task function, which includes a call to the nested function.
async function taskFunction(input: string): Promise<string> {
  return await traced(
    async () => {
      // Log the beginning of the main task.
      currentSpan().log({ input: input });

      // Call the nested function – its trace will appear as a child span.
      const nestedResult = await nestedFunction(input);

      // Log the completion of the main task.
      currentSpan().log({ output: nestedResult });
      return nestedResult;
    },
    { name: "taskFunction", type: "function" }
  );
}

Eval("ai-workflow", {
  experimentName: "trace-sample2",
  data: () => [{ input: "Test1" }, { input: "Test2" }],
  task: async (input) => {
    return await taskFunction(input);
  },
  scores: [],
});
