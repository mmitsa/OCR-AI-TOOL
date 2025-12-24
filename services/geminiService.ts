
import { GoogleGenAI, Type } from "@google/genai";
import { DocumentData } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeDocumentText = async (rawText: string): Promise<DocumentData | null> => {
  if (!API_KEY) {
    console.error("API Key missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم بتحليل النص التالي المستخرج من وثيقة رسمية واستخرج البيانات بصيغة JSON وفق معايير المركز الوطني للوثائق والمحفوظات.
      النص: "${rawText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            administration: { type: Type.STRING, description: "الإدارة العليا" },
            department: { type: Type.STRING, description: "القسم المختص" },
            docType: { type: Type.STRING, description: "نوع الوثيقة" },
            securityLevel: { type: Type.STRING, description: "درجة السرية (عادي، سري، سري للغاية)" },
            subject: { type: Type.STRING, description: "الموضوع" },
            entryNumber: { type: Type.STRING, description: "رقم القيد" },
            date: { type: Type.STRING, description: "التاريخ" },
            idsNames: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "أرقام الهوية والأسماء المذكورة"
            },
          },
          required: ["administration", "department", "docType", "securityLevel", "subject", "entryNumber", "date"]
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as DocumentData;
  } catch (error) {
    console.error("Error analyzing document:", error);
    return null;
  }
};
