export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gameId = parseInt(id);

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { gameParticipants: { include: { player: true } } },
    });

    const gameName = game?.name || `Partida ${gameId}`;
    const playerNames = game?.gameParticipants.map(gp => gp.player.name).join(", ");
    
    const ogImageUrl = new URL(`/api/og`, 'https://carioca.vercel.app');
    ogImageUrl.searchParams.set('title', gameName);
    ogImageUrl.searchParams.set('subtitle', `Jugadores: ${playerNames}`);

    return {
      title: `${gameName}`,
      description: `Detalles de la partida de Carioca entre ${playerNames}`,
      openGraph: {
        images: [{
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: gameName,
        }],
      },
      twitter: {
        images: [ogImageUrl.toString()],
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: `Detalles de Partida`,
      description: `Información detallada de la partida de Carioca`,
    };
  }
}

import { redirect } from "next/navigation";
import { ScoreTable } from "@/components/score-table";
import { prisma } from "@/lib/db";
import { NavigateButton } from "@/components/ui/navigate-button";
import { GameActions } from "@/components/game-actions";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  // Esperar a que params se resuelva antes de acceder a sus propiedades
  const { id } = await params;
  const gameId = parseInt(id);

  if (isNaN(gameId)) {
    redirect("/");
  }

  // El resto del código permanece igual...
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      gameParticipants: {
        include: { player: true }
      },
      rounds: {
        orderBy: { roundNumber: "asc" },
      },
    },
  });

  if (!game) {
    redirect("/");
  }

  // Obtener todas las puntuaciones para este juego con la nueva estructura
  const scores = await prisma.score.findMany({
    where: {
      participant: {
        gameId: gameId,
      },
    },
    include: {
      participant: true,
      round: true
    }
  });

  // Preparar datos para el ScoreTable
  const players = game.gameParticipants.map(gp => ({
    id: gp.playerId,
    participantId: gp.id,
    name: gp.player.name
  }));

  // Adaptar puntuaciones al formato esperado por ScoreTable
  const adaptedScores = scores.map(score => ({
    playerId: score.participant.playerId,
    roundId: score.roundId,
    value: score.value
  }));

  // Determinar la siguiente ronda (si el juego no ha terminado)
  const nextRoundNumber = game.rounds.length < 7 ? game.rounds.length + 1 : null;

  // Comprobamos si el juego está activo para la lógica de finalización
  const isGameActive = game.isActive;

  return (
    <main className="container mx-auto py-8 px-4">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">
          {game.name || `Partida del ${new Date(game.createdAt).toLocaleDateString()}`}
        </h1>
        {!isGameActive && (
          <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
            Partida finalizada el {game.completedAt ? new Date(game.completedAt).toLocaleDateString() : ""}
          </span>
        )}
      </div>
      <NavigateButton href="/" variant="outline">
        Volver al inicio
      </NavigateButton>
    </div>

    <ScoreTable
      players={players}
      rounds={game.rounds}
      scores={adaptedScores}
    />

    {/* Reemplazar la lógica condicional con el nuevo componente */}
    <GameActions 
      gameId={gameId}
      nextRoundNumber={nextRoundNumber}
      isGameActive={isGameActive}
    />
  </main>
  );
}