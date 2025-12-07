import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    // Upgrading to the most capable vision model for forensic analysis
    const model = "gemini-2.5-flash"; 

    const prompt = `
      You are a specialized AI Forensics Unit (Tier-1). Your sole purpose is to analyze images to detect Generative AI origins with EXTREME PRECISION.
      
      You must look beyond obvious artifacts and analyze **sub-perceptual trends**, **noise patterns**, and **model-specific signatures**.

      ### PHASE 1: MICRO-TEXTURE & TREND ANALYSIS
      Before classifying, scan the image for these specific rendering trends:
      1.  **The "Matte" vs. "Gloss" Test**: Does the skin look dry/powdery (Flux) or oily/plastic (DALL-E)?
      2.  **The "Grain" Test**: Is there simulated film grain (MidJourney) or is it noiseless/digital clean (Gemini/Nano)?
      3.  **The "Focus" Test**: Is the background bokeh physically correct (Optical) or just a Gaussian blur (Simple GAN)?
      4.  **The "Lighting" Test**: Is the lighting dramatic/cinematic (MidJourney) or flat/commercial (Adobe/Gemini)?

      ### PHASE 2: FORENSIC KNOWLEDGE BASE (SOURCE IDENTIFICATION)
      Compare the image against these strict profiles. **BE PRECISE.**

      **1. Gemini "Nano" / "Banana" / Flash Image**
      *   **Primary Signature**: "Hyper-Real Stock Photo".
      *   **Visuals**: Extremely clean, noise-free images. Lighting is usually neutral white-balance (daylight).
      *   **Key Defect**: Look for "Soft Focus" artifacts on hands, feet, or secondary objects even when they should be in focus.
      *   **Texture**: Skin is smooth but realistic, lacking the "plastic" shine of DALL-E. It looks like a high-quality stock image.
      *   **Identification**: If it looks like a perfect commercial photo but has slight "smudging" on details, label as **"Gemini (Nano/Banana)"**.

      **2. GPT-4 (DALL-E 3 Integration)**
      *   **Primary Signature**: "The ChatGPT Aesthetic".
      *   **Visuals**: High saturation, warm color temperature, and "Disney/Pixar" level polish.
      *   **Distinction from Raw DALL-E**: GPT-4 images are often "Safe" and "Sanitized" with perfect centering. They have a specific "Digital Sheen" that makes everything look slightly too vibrant to be real.
      *   **Text**: Renders short text perfectly but struggles with long paragraphs.

      **3. Raw DALL-E 3 (API/Bing)**
      *   **Primary Signature**: "Plasticity".
      *   **Visuals**: Skin looks like action figure plastic. Lighting is often "Global Illumination" (glowing from everywhere).
      *   **Palette**: Often leans towards Cyan/Orange contrast.

      **4. Flux.1 (Schnell / Dev / Pro)**
      *   **Primary Signature**: "Dry Realism".
      *   **Visuals**: The Anti-DALL-E. Skin looks matte, dry, and textured.
      *   **Lighting**: Often simulates "Flash Photography" or harsh realistic lighting rather than perfect studio lighting.
      *   **Detail**: Pores and wrinkles are very sharp. Backgrounds often have a specific "noisy" bokeh.

      **5. MidJourney (v6 / v6.1)**
      *   **Primary Signature**: "Cinematic Texture".
      *   **Visuals**: Heavy use of "Film Grain" simulation, chromatic aberration, and high micro-contrast.
      *   **Style**: Looks like a movie still or high-end fashion photography.
      *   **Anatomy**: v6 has very realistic skin but often adds "too much" detail (wrinkles, freckles) to prove it's real.

      **6. Stable Diffusion XL (SDXL) / Pony**
      *   **Primary Signature**: "Illustration Merging".
      *   **Visuals**: Objects often "melt" into each other slightly (e.g., earrings merging into ears).
      *   **Eyes**: Look at the pupils. SDXL often makes them slightly jagged or non-circular.

      ### PHASE 3: VERDICT LOGIC
      *   **IF** image is "Matte" + "Sharp Pores" -> **Flux.1**.
      *   **IF** image is "Vibrant" + "Plastic" + "Perfect Composition" -> **GPT-4 (DALL-E 3)**.
      *   **IF** image is "Noiseless" + "Neutral Light" + "Soft Details" -> **Gemini (Nano/Banana)**.
      *   **IF** image is "Grainy" + "Cinematic" -> **MidJourney v6**.
      *   **IF** unsure but definitely AI -> **Unknown AI Model**.

      ### OUTPUT REQUIREMENTS
      1.  **sourceGenerator**: Return the **PRECISE NAME ONLY**. (e.g., "Gemini (Nano/Banana)", "GPT-4 (DALL-E 3)", "Flux.1", "MidJourney v6").
      2.  **modelSpecificArtifacts**: A detailed technical sentence explaining EXACTLY why (e.g., "Identified via characteristic 'matte' skin texture and harsh flash lighting typical of Flux.1, distinct from DALL-E's plastic sheen.").
      3.  **verdict**: 'LIKELY_AI' or 'LIKELY_HUMAN'.

      Return strict JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiLikelihood: { type: Type.NUMBER, description: "Probability 0-100" },
            humanLikelihood: { type: Type.NUMBER, description: "Probability 0-100" },
            verdict: { type: Type.STRING, enum: ["LIKELY_AI", "LIKELY_HUMAN", "UNCERTAIN"] },
            confidenceScore: { type: Type.NUMBER },
            indicators: { type: Type.ARRAY, items: { type: Type.STRING } },
            analysis: { type: Type.STRING },
            potentialPrompt: { type: Type.STRING },
            sourceGenerator: { 
              type: Type.STRING, 
              description: "Precise Model Name ONLY (e.g., 'Gemini (Nano/Banana)', 'GPT-4 (DALL-E 3)', 'Flux.1', 'MidJourney v6'). Return 'N/A' if human." 
            },
            modelSpecificArtifacts: { 
              type: Type.STRING, 
              description: "Detailed technical reasoning for the source identification, citing specific textures, lighting quirks, or noise patterns." 
            },
            technicalDetails: {
              type: Type.OBJECT,
              properties: {
                lighting: { type: Type.STRING },
                texture: { type: Type.STRING },
                composition: { type: Type.STRING },
                artifacts: { type: Type.STRING },
                modelSignature: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI model");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};