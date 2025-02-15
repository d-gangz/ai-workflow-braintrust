"use server";
// ok this worksss!!! so gotta use the currentSpan() to log the input and output of the function.

import { Eval } from "braintrust";
import { taskFunction } from "./trace-sample3-code";

const inputData = [{ input: "Test1" }, { input: "Test2" }];

Eval("ai-workflow", {
  experimentName: "trace-sample3",
  data: () => inputData,
  task: async (input) => {
    return await taskFunction(input);
  },
  scores: [],
});
