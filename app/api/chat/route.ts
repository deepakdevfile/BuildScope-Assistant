import { validateMessages, geminiProvider, mockProvider, runChat } from "@/lib/chat";
import { rateLimited } from "@/lib/leads";
import { ChatProvider } from "@/lib/types";


const MAX_BODY = 40_000;

function pickProvider(): ChatProvider | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if(apiKey){
        return geminiProvider({
          apiKey,
          model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        });
    }

    if(process.env.CHAT_MOCK === '1' || process.env.NODE_ENV !== 'production'){
        return mockProvider;
    }

    return null;
}

export async function POST(req: Request): Promise<Response> {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if(rateLimited(`chat:${ip}`, 20)){
        return Response.json({ error: 'You are sending messages too quickly. Please wait a moment.'}, { status: 429 });
    }

    const text = await req.text();
    if(text.length > MAX_BODY){
        return Response.json({ error: 'Request too large' }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try{
        body = JSON.parse(text || '{}') as Record<string, unknown>;
    } catch {
        return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const messages = validateMessages(body.messages);
    if(!messages){
        return Response.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const provider = pickProvider();
    if(!provider){
        return Response.json({ error: 'The assistant is unavailable right now.', fallback: true }, { status: 503 });
    }

    try {
        const result = await runChat(provider, messages, body.selection);
        return Response.json(result);
    } catch(err){
        console.log('Chat failed', err);
        return Response.json({ error: 'The assistant hit a problem. Please try again.', fallback: true }, { status: 502 });
    }
}