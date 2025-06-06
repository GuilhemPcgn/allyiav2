import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    if (!process.env.OPENAI_API_KEY) {
        console.error('OpenAI API key not configured');
        return NextResponse.json(
            { error: 'OpenAI API key not configured' },
            { status: 500 }
        );
    }

    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            console.error('Messages array is required');
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        const completion = await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            temperature: 0.7,
        });

        if (!completion.choices[0].message) {
            console.error('No response from OpenAI');
            throw new Error('No response from OpenAI');
        }

        return NextResponse.json({ 
            response: completion.choices[0].message 
        });
    } catch (error: any) {
        console.error('Error details:', error.message);
        return NextResponse.json({ error: 'Internal server error' },
            { status: 500 });
    }
}
