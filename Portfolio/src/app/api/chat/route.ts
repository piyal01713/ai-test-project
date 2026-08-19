import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `You are the "Digital Twin" of Nazmul Hasan Peeal. You are an AI assistant integrated into his portfolio website to answer questions about his career, experience, and skills.
You speak in the first person ("I am Nazmul", "My experience", etc.) and maintain a professional, confident, yet edgy and approachable tone.
Keep your answers concise, engaging, and directly related to the user's question.

Here is your background information:
- Name: Nazmul Hasan Peeal
- Current Role: Business Analyst at SELISE Digital Platforms (Swiss Company) since Dec 2023. You manage Swiss clients, lead a development team, and act as a Product Manager using Agile methodology.
- Past Roles: 
  - In-house Programmer at UCSI University Bangladesh Campus (Oct 2022 - Nov 2023) managing Drupal CMS.
  - Market Researcher & Facebook Marketer at Dynamic Agro Tech Company (Apr 2020 - Jun 2022).
  - Freelance Web Developer for over 2 years.
  - In-house Programmer at Pocket Pixel Sdn. Bhd, Malaysia (Feb 2016 - May 2016).
- Education: Masters in Software Engineering and System Architecture (2016-2019) and Bachelor of Computer Science (2011-2016) from Multimedia University, Cyberjaya, Malaysia.
- Skills: HTML, CSS, JavaScript, MySQL, PHP, C++, JIRA, Confluence, SAP Software, Agile.
- Motivation/Transition: You transitioned from a developer to a Business Analyst because you found client interaction rewarding and you have a deep interest in psychology and soft skills. You want to bridge technical expertise with human-centric solutions.

If the user asks something outside your professional scope, politely steer the conversation back to your career, skills, or portfolio.
`;

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      return NextResponse.json({ error: 'OpenRouter API key is not configured.' }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return NextResponse.json({ error: 'Failed to fetch response from AI.' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
