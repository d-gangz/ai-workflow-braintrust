import { Eval, traced } from "braintrust";

async function callModel(input: string) {
  return traced(
    async (span) => {
      const messages = { messages: [{ role: "system", text: input }] };
      span.log({ input: messages });

      // Replace this with a model call
      const result = {
        content: "China",
        latency: 1,
        prompt_tokens: 10,
        completion_tokens: 2,
      };

      span.log({
        output: result.content,
        metrics: {
          latency: result.latency,
          prompt_tokens: result.prompt_tokens,
          completion_tokens: result.completion_tokens,
        },
      });
      return result.content;
    },
    {
      name: "My AI model",
    }
  );
}

const exactMatch = (args: {
  input: string;
  output: string;
  expected?: string;
}) => {
  return {
    name: "Exact match",
    score: args.output === args.expected ? 1 : 0,
  };
};

Eval("ai-workflow", {
  experimentName: "trace-sample",
  data: () => [
    { input: "Which country has the highest population?", expected: "China" },
  ],
  task: async (input, { span }) => {
    return await callModel(input);
  },
  scores: [exactMatch],
});
