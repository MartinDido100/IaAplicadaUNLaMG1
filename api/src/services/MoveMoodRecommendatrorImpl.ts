const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export type MoodIntent = {
  mood: string;                         // ej: "ansioso", "nostálgico"
  intent: "mantener" | "cambiar";       // mantener el estado o cambiarlo
  preferredGenres?: string[];           // opcional: ["drama","comedia"]
  avoid?: string[];                     // opcional: ["terror","violencia"]
};

export type MovieSuggestion = {
  title: string;
  reason: string;
  year?: string | undefined;
  alt?: string[] | undefined;
};

function buildPrompt(input: MoodIntent) {
  const lines = [
    "Eres un recomendador de cine conciso.",
    `Estado actual: "${input.mood}".`,
    `Objetivo: ${input.intent === "mantener" ? "mantener ese estado" : "cambiar hacia uno más positivo"}.`,
    input.preferredGenres?.length ? `Gustos: ${input.preferredGenres.join(", ")}.` : "",
    input.avoid?.length ? `Evitar: ${input.avoid.join(", ")}.` : "",
    "",
    "Devuelve SOLO un JSON válido con este formato:",
    `{"title":"<título>","year":"<opcional>","reason":"<por qué es adecuada>","alt":["<opcional 1>","<opcional 2>"]}`,
    "No agregues texto fuera del JSON."
  ].filter(Boolean).join("\n");
  return lines;
}

export async function recommendMovieGemini(input: MoodIntent): Promise<MovieSuggestion> {
  if (!GEMINI_API_KEY) throw new Error("Falta GEMINI_API_KEY en variables de entorno.");

  const prompt = buildPrompt(input);

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }]}]
    })
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Gemini ${res.status} ${res.statusText} :: ${text}`);

  // Respuesta típica: candidates[0].content.parts[0].text
  let raw = "";
  try {
    const data = JSON.parse(text);
    raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch { raw = text; }

  // Extraer JSON por si viene rodeado de texto
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : raw;

  try {
    const parsed = JSON.parse(jsonStr);
    return {
      title: String(parsed.title || "").trim() || "Sugerencia no disponible",
      reason: String(parsed.reason || "Sin explicación").trim(),
      year: parsed.year ? String(parsed.year) : undefined,
      alt: Array.isArray(parsed.alt) ? parsed.alt.map((s: any) => String(s)) : undefined
    };
  } catch {
    // Fallback si no vino JSON limpio
    return {
      title: raw.replace(/[\r\n]+/g, " ").slice(0, 120) || "Sugerencia no disponible",
      reason: "Respuesta libre del modelo (no JSON)."
    };
  }
}
