import { verifySessionToken, getSessionCookieName } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
        return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}
