export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST 요청만 사용할 수 있어요." });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Vercel 환경변수 GEMINI_API_KEY가 필요해요." });
  try {
    const { image, mimeType } = req.body || {};
    if (!image || !["image/jpeg", "image/png", "image/webp"].includes(mimeType)) return res.status(400).json({ error: "JPG, PNG 또는 WEBP 사진을 올려 주세요." });
    if (typeof image !== "string" || image.length > 16_800_000) return res.status(413).json({ error: "사진이 너무 커요. 다른 사진을 선택해 주세요." });
    const prompt = `Transform the uploaded image into a simple hand-drawn diary doodle illustration. Preserve the subject's recognizable shape, colors, and distinctive features. Confident bold black fineliner outlines, slightly wobbly imperfect hand-drawn lines, simplified shapes, flat pale watercolor washes in 3 to 4 soft muted colors, imperfect fills, generous white paper, subtle paper grain and watercolor texture. Charming, slightly clumsy, ugly-cute, like a small illustration cut from a personal diary. Works for any subject: person, animal, food, object, plant, building, landscape. If a person, simplify the face to dot eyes, small smile, tiny blush while preserving hairstyle, face shape, accessories and outfit colors. Do not anthropomorphize food or objects. Isolate the main subject. No text, captions, watermark, unrelated background elements, cast shadow, glow, photorealism, polished vector art, glossy 3D, excessive detail, strong gradients, or dramatic shadows. Plain white paper-like background if transparency is unavailable.`;
    const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gemini-nano-banana-2.1", input: [{ type: "image", mime_type: mimeType, data: image }, { type: "text", text: prompt }], response_format: { type: "image", mime_type: "image/jpeg", image_size: "1K" } })
    });
    const data = await upstream.json();
    if (!upstream.ok) { console.error("Gemini API error", upstream.status, data?.error?.message || ""); return res.status(502).json({ error: "이미지 생성에 실패했어요. API 키와 사용량 설정을 확인해 주세요." }); }
    const generated = data.output_image?.data || data.steps?.flatMap(s => s.content || []).find(c => c.type === "image")?.data;
    if (!generated) return res.status(502).json({ error: "이미지 결과가 없어요. 다시 시도해 주세요." });
    return res.status(200).json({ image: generated, mimeType: data.output_image?.mime_type || "image/jpeg" });
  } catch (error) { console.error("Image generation error", error); return res.status(500).json({ error: "처리 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요." }); }
}