// src/app/partidas/[id]/new-round/page.tsx
import { NewRoundForm } from "@/components/new-round-form";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function NewRoundPage({ 
    params, 
    searchParams 
  }: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ roundNumber?: string }> 
  }) {
    // Esperar a que los parámetros se resuelvan
    const { id } = await params;
    const { roundNumber: roundNumberStr = "1" } = await searchParams;
    
    const gameId = parseInt(id);
    const roundNumber = parseInt(roundNumberStr);
  
  if (isNaN(gameId) || isNaN(roundNumber) || roundNumber < 1 || roundNumber > 7) {
    redirect("/");
  }

  // Obtener participantes del juego con sus jugadores asociados
  const gameParticipants = await prisma.gameParticipant.findMany({
    where: { gameId },
    include: { player: true },
    orderBy: { player: { name: 'asc' } }
  });

  if (gameParticipants.length === 0) {
    redirect("/");
  }

  // Preparar jugadores para el formulario
  const players = gameParticipants.map(gp => ({
    id: gp.playerId,  // Usamos el ID del jugador para compatibilidad
    participantId: gp.id, // Añadimos el ID de participante
    name: gp.player.name
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <NewRoundForm 
        gameId={gameId} 
        players={players} 
        roundNumber={roundNumber} 
      />
    </div>
  );
}