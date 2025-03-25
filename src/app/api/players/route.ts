export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: {
        name: "asc",
      },
    });
    
    return NextResponse.json(players);
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    return NextResponse.json(
      { error: "Error al obtener los jugadores" },
      { status: 500 }
    );
  }
}