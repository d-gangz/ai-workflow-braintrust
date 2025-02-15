import { Eval } from "braintrust";
import { promptChain } from "./prompt-chain-code";

const inputData = [
  "A story about a mysterious sign that guides a wanderer.",
  "A futuristic tale featuring a handphone with unusual powers.",
  "An adventure where digital signals lead to hidden treasures.",
  "A short mystery blending modern tech with ancient clues.",
  "A narrative where an enchanted handphone reveals secret messages.",
];

// use "bunx braintrust eval actions/prompt-chain/prompt-chain.eval.ts" to run this eval
Eval("AI workflow", {
  experimentName: "prompt-chain",
  data: () => inputData.map((input) => ({ input: { input } })),

  task: async ({ input }: { input: string }) => {
    return await promptChain(input);
  },

  scores: [],

  metadata: {
    description:
      "Evaluate the prompt chain steps. There are 2 LLM calls. One to generate the outline and another to generate the end result.",
    model: "gemini-2.0-flash",
  },
});
