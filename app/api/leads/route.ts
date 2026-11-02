import { handleLead } from "@/lib/leads";

const MAX_BODY = 40_000;

export async function POST(req: Request): Promise<Response>{
    const text = await req.text();
    if(text.length > MAX_BODY){
        return Response.json({ error: 'Request too large'}, { status: 413 });
    }

    let body: unknown;
    try{
        body = JSON.parse(text || '{}');
    } catch {
        return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { status, json } = handleLead(body, ip);
    return Response.json(json, { status });
}