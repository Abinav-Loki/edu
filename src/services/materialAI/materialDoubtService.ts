import { generateGroundedAnswer } from "../rag/answerService";
import { DocumentSourceCitation } from "../rag/types";

export interface MaterialDoubtResponse {
  answer: string;
  sources: DocumentSourceCitation[];
  grounded: boolean;
  retrievalStatus: string;
  canAskGeneralAI?: boolean;
}

/**
 * Ask a Doubt grounded strictly in a selected uploaded material.
 */
export async function askMaterialDoubt(params: {
  materialId: string;
  materialName: string;
  question: string;
  subject?: string;
}): Promise<MaterialDoubtResponse> {
  const { materialId, materialName, question, subject } = params;

  const result = await generateGroundedAnswer(question, {
    materialId,
    subject
  });

  if (result.retrievalStatus === "no_passages_found" || !result.grounded || result.sources.length === 0) {
    return {
      answer: `I couldn't find enough information about this in "${materialName}".`,
      sources: [],
      grounded: false,
      retrievalStatus: result.retrievalStatus,
      canAskGeneralAI: true
    };
  }

  return {
    answer: result.answer,
    sources: result.sources,
    grounded: true,
    retrievalStatus: result.retrievalStatus,
    canAskGeneralAI: false
  };
}
