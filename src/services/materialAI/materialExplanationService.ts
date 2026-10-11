import { generateGroundedAnswer } from "../rag/answerService";
import { DocumentSourceCitation } from "../rag/types";

export interface MaterialExplanationResult {
  topic: string;
  explanation: string;
  keyPoints: string[];
  example?: string;
  sources: DocumentSourceCitation[];
  grounded: boolean;
  status: "success" | "no_context" | "error";
  message?: string;
}

/**
 * Explain a topic using grounded context from a selected material.
 */
export async function explainMaterialTopic(params: {
  materialId: string;
  materialName: string;
  topic: string;
  subject?: string;
}): Promise<MaterialExplanationResult> {
  const { materialId, materialName, topic, subject } = params;

  const query = `Explain the topic "${topic}" in detail, highlighting key points, practical examples, and core definitions.`;

  const ragResult = await generateGroundedAnswer(query, {
    materialId,
    subject
  });

  if (ragResult.retrievalStatus === "no_passages_found" || !ragResult.sources || ragResult.sources.length === 0) {
    return {
      topic,
      explanation: `I couldn't find enough information about "${topic}" in "${materialName}".`,
      keyPoints: [],
      sources: [],
      grounded: false,
      status: "no_context",
      message: `The topic "${topic}" is not covered in the passages extracted from ${materialName}.`
    };
  }

  const firstSource = ragResult.sources[0];
  const keyPoints = [
    `Based on ${materialName} (Page ${firstSource?.pageNumber || 1}), ${topic} is a key concept in ${subject || "this subject"}.`,
    `Extracted passage emphasis: "${firstSource?.excerpt.slice(0, 140)}..."`,
    `Refer to Page ${firstSource?.pageNumber || 1} for complete diagrammatic and mathematical details.`
  ];

  return {
    topic,
    explanation: ragResult.answer,
    keyPoints,
    example: `Practical context from ${materialName}: ${firstSource?.excerpt.slice(0, 180)}...`,
    sources: ragResult.sources,
    grounded: true,
    status: "success"
  };
}
