import { promptChain } from "./prompt-chain-code";

async function main() {
  const input = "A story about a mysterious sign that guides a wanderer";

  console.log("\n🚀 Starting prompt chain...");
  console.log("📝 Input:", input);

  try {
    const result = await promptChain(input);

    console.log("\n📋 Story Outline:");
    console.log("----------------");
    console.log(result.outline);

    console.log("\n📖 Generated Story:");
    console.log("----------------");
    console.log(result.story);
  } catch (error) {
    console.error("\n❌ Error running prompt chain:", error);
    process.exit(1);
  }
}

main();
