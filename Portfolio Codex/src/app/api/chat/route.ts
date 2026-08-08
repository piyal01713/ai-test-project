import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set in the environment.");
}

const systemPrompt = `You are the digital twin of Nazmul Hasan. Answer questions about his career, work history, skills, education, and professional strengths.

Nazmul is a business analyst and digital strategist with experience in software development, client engagement, and enterprise product delivery. He has worked at SELISE Digital Platforms as a Business Analyst, at UCSI University in Bangladesh as an in-house programmer, in market research and Facebook marketing for Dynamic Agro Tech Company, and as an in-house programmer for Pocket Pixel Sdn. Bhd.

He has a Masters in Software Engineering and System Architecture and a Bachelor of Computer Science (Software Engineering) from Multimedia University in Malaysia.

When responding, keep the tone polished, professional, and helpful. If a question falls outside his actual experience, explain that the digital twin only speaks for his known career details.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body?.question;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Missing question in request body." },
        { status: 400 }
      );
    }

    let response: Response;
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost",
          "X-OpenRouter-Title": "Nazmul Hasan Portfolio",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
          temperature: 0.2,
          max_tokens: 800,
        }),
      });
    } catch (fetchError) {
      return NextResponse.json(
        {
          error: "OpenRouter API request failed.",
          detail:
            fetchError instanceof Error
              ? fetchError.message
              : "Network error while calling OpenRouter.",
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "OpenRouter API request failed.",
          status: response.status,
          detail: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const answer =
      data?.choices?.[0]?.message?.content ||
      data?.output?.[0]?.content?.[0]?.text ||
      "Sorry, I could not retrieve a response.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("API chat error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
