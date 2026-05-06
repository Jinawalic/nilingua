import { getNextStep } from "@/lib/adaptive";

export async function POST(req: Request) {
    const { score } = await req.json();

    const result = getNextStep(score);

    return Response.json(result);
}
