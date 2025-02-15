"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { promptChain } from "@/actions/prompt-chain/prompt-chain-code";

export function PromptChain() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    outline: string;
    story: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await promptChain(input);
      setResult(response);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      <Textarea
        placeholder="Enter your text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[100px]"
      />

      <Button
        onClick={handleGenerate}
        disabled={loading || !input.trim()}
        className="w-full"
      >
        {loading ? "Generating..." : "Generate"}
      </Button>

      {result && (
        <div className="space-y-4 mt-8">
          <div className="space-y-2">
            <h3 className="font-semibold">Outline:</h3>
            <div className="p-4 rounded-md bg-muted whitespace-pre-wrap">
              {result.outline}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Story:</h3>
            <div className="p-4 rounded-md bg-muted whitespace-pre-wrap">
              {result.story}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
