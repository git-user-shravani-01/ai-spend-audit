import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { tools, savings } = body;

    const prompt = `
You are an AI financial infrastructure advisor.

Analyze the following AI tool spending data and generate a professional executive summary.

Tools:
${JSON.stringify(tools, null, 2)}

Estimated Monthly Savings:
$${savings}

Requirements:
- Around 100 words
- Professional tone
- Mention overspending opportunities
- Mention optimization opportunities
- Mention annual savings
- Sound like a real SaaS audit platform
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({
      summary,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      summary:
        "Your AI infrastructure stack shows opportunities for optimization through plan consolidation and smarter vendor allocation. Additional savings may be unlocked through infrastructure credits and usage optimization strategies.",
    });
  }
}
