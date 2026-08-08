import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { analysePortfolio } from "@/lib/analytics";
import { MOCK_PORTFOLIOS, MOCK_PORTFOLIO_KEYS } from "@/data/mock/portfolios";
import {
  NARRATIVE_MODEL,
  NARRATIVE_SYSTEM_PROMPT,
  buildNarrativeUserMessage,
} from "@/lib/ai/narrative-prompt";
import type { PortfolioAnalysis } from "@/types/analysis";

export const runtime = "nodejs";
export const maxDuration = 60;

function streamNarrative(analysis: PortfolioAnalysis) {
  const client = new Anthropic();

  // Adaptive thinking at low effort: the response is now a structured multi-section
  // explanation, and letting the model plan the structure measurably improves it.
  // max_tokens covers thinking plus output, so it is sized well above the ~900 tokens
  // a 650-word answer needs.
  const stream = client.messages.stream({
    model: NARRATIVE_MODEL,
    max_tokens: 6000,
    system: NARRATIVE_SYSTEM_PROMPT,
    thinking: { type: "adaptive" },
    output_config: { effort: "low" },
    messages: [{ role: "user", content: buildNarrativeUserMessage(analysis) }],
  });

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\n[The narrative could not be generated for this portfolio.]"));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(encoder.encode(`\n\n[Narrative interrupted: ${message}]`));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });
}

function textStreamResponse(analysis: PortfolioAnalysis) {
  return new Response(streamNarrative(analysis), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

function missingKeyResponse() {
  return NextResponse.json(
    {
      error: "ANTHROPIC_API_KEY is not set",
      hint: "Add ANTHROPIC_API_KEY to .env.local and restart the dev server.",
    },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return missingKeyResponse();

  const key = new URL(request.url).searchParams.get("portfolio") ?? "aarav";
  const portfolio = MOCK_PORTFOLIOS[key];

  if (!portfolio) {
    return NextResponse.json(
      { error: `Unknown portfolio "${key}"`, available: MOCK_PORTFOLIO_KEYS },
      { status: 404 },
    );
  }

  return textStreamResponse(analysePortfolio(portfolio));
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return missingKeyResponse();

  let body: { portfolio?: string; analysis?: PortfolioAnalysis };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (body.analysis?.allocation && body.analysis?.findings) {
    return textStreamResponse(body.analysis);
  }

  const portfolio = body.portfolio ? MOCK_PORTFOLIOS[body.portfolio] : undefined;

  if (!portfolio) {
    return NextResponse.json(
      { error: "Provide either a full `analysis` object or a known `portfolio` key", available: MOCK_PORTFOLIO_KEYS },
      { status: 422 },
    );
  }

  return textStreamResponse(analysePortfolio(portfolio));
}
