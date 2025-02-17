"use server";

import { Eval } from "braintrust";
import { promptChain } from "./trace-sample3-code";

const inputData = [
  { input: "A story about a mysterious sign that guides a wanderer." },
  //   { input: "A futuristic tale featuring a handphone with unusual powers." },
  //   { input: "An adventure where digital signals lead to hidden treasures." },
  //   { input: "A short mystery blending modern tech with ancient clues." },
  //   {
  //     input: "A narrative where an enchanted handphone reveals secret messages.",
  //   },
];

Eval("ai-workflow", {
  experimentName: "trace-sample3",
  data: () => inputData,
  task: async (input) => {
    return await promptChain(input);
  },
  scores: [],
});
