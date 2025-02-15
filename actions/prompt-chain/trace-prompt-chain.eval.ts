"use server";

import { Eval } from "braintrust";
import { promptChain } from "./prompt-chain-code";

const inputData = [
  { input: "A story about a mysterious sign that guides a wanderer." },
  { input: "A futuristic tale featuring a handphone with unusual powers." },
  { input: "An adventure where digital signals lead to hidden treasures." },
  { input: "A short mystery blending modern tech with ancient clues." },
  {
    input: "A narrative where an enchanted handphone reveals secret messages.",
  },
];

// Run with: bunx braintrust eval actions/prompt-chain/trace-prompt-chain.eval.ts
Eval("ai-workflow", {
  experimentName: "trace-prompt-chain",
  data: () => inputData,

  task: async (input) => {
    // The detailed LLM metrics are logged inside the traced generateLLMResponse function.
    return await promptChain(input);
  },

  scores: [],

  metadata: {
    description:
      "Evaluate the prompt chain steps. There are 2 LLM calls that generate an outline and then the final story. Detailed metrics (latency, prompt_tokens, completion_tokens, and total_tokens) are logged per call.",
    model: "gemini-2.0-flash",
  },
});
