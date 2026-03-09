import { HfInference } from '@huggingface/inference';
import { RiskAnalysis } from './riskEngine';
import { ActionProposal } from './executor';

const HF_TOKEN = process.env.HF_ACCESS_TOKEN;
const HF_MODEL = process.env.HF_MODEL || "mistralai/Mistral-7B-Instruct-v0.3";
let hf: HfInference | null = null;

const getClient = () => {
  if (!HF_TOKEN) {
    console.warn("HF_ACCESS_TOKEN missing - using deterministic narrative fallback");
    return null;
  }
  if (!hf) {
    hf = new HfInference(HF_TOKEN);
  }
  return hf;
};

export async function generateNarrative(input: {
  risk: RiskAnalysis;
  proposal: ActionProposal | null;
  market: any;
}) {
  try {
    const prompt = `
You are the Autonomous Treasury Guardian AI. Produce a concise, professional narrative for a treasury dashboard.

RISK STATUS:
${JSON.stringify(input.risk, null, 2)}

PROPOSED ACTION:
${JSON.stringify(input.proposal, null, 2)}

MARKET DATA:
${JSON.stringify(input.market, null, 2)}

Write a 3–5 sentence explanation covering:
- The current treasury state
- Why the risk level is what it is
- Why the proposed action is justified
- Short forward-looking note
`;

    const client = getClient();
    if (!client) {
      return "AI reasoning unavailable. HF_ACCESS_TOKEN not set; using deterministic risk interpretation.";
    }

    const completion = await client.textGeneration({
      model: HF_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.3,
        return_full_text: false
      }
    });

    return completion.generated_text;
  } catch (err) {
    console.error("LLM Generation Failed", err);
    return "AI reasoning unavailable. Running deterministic risk interpretation only.";
  }
}

