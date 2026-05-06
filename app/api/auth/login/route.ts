import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return Response.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const isValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isValid) {
            return Response.json(
                { message: "Invalid password" },
                { status: 401 }
            );
        }

        return Response.json({
            message: "Login successful",
            user,
        });
    } catch (error) {
        console.error("Login error:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}