// src/components/new-round-form.tsx (actualizado)
// src/components/new-round-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";

type Player = {
  id: number;
  participantId: number;
  name: string;
  dealOrder?: number;
};

type NewRoundFormProps = {
  gameId: number;
  players: Player[];
  roundNumber: number;
};

export function NewRoundForm({ gameId, players, roundNumber }: NewRoundFormProps) {
  const [scores, setScores] = useState<Record<number, string>>(
    Object.fromEntries(players.map(player => [player.id, ""]))
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Función para obtener la descripción de la mano
  const getRoundDescription = (roundNumber: number) => {
    const descriptions = [
      "Dos piernas",
      "Una pierna y una escalera",
      "Dos escaleras",
      "Tres piernas",
      "Dos piernas y una escalera",
      "Dos escaleras y una pierna",
      "Tres escaleras"
    ];
    return descriptions[roundNumber - 1] || `Mano ${roundNumber}`;
  };

  const handleScoreChange = (playerId: number, value: string) => {
    setScores({ ...scores, [playerId]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Convertir los valores a números y validar
    const numericScores: Record<number, number> = {};
    let hasError = false;

    for (const [playerIdStr, scoreValue] of Object.entries(scores)) {
      const numValue = parseInt(scoreValue);
      if (isNaN(numValue)) {
        alert(`Por favor ingrese un valor numérico para todos los jugadores.`);
        hasError = true;
        break;
      }
      numericScores[parseInt(playerIdStr)] = numValue;
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          roundNumber,
          scores: numericScores,
        }),
      });

      if (response.ok) {
        router.push(`/partidas/${gameId}`);
        router.refresh();
      } else {
        throw new Error("Error al guardar las puntuaciones");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al guardar las puntuaciones");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para determinar quién reparte en la próxima ronda
  const getNextDealer = () => {
    if (!players.some(p => p.dealOrder)) return null;

    // Ordenar jugadores por orden de repartida
    const sortedPlayers = [...players].sort((a, b) =>
      (a.dealOrder || 0) - (b.dealOrder || 0)
    );

    // Calcular la próxima ronda
    const nextRoundNumber = roundNumber + 1;

    // Si ya estamos en la última ronda, no hay próximo repartidor
    if (nextRoundNumber > 7) return null;

    // El índice del próximo repartidor
    const nextDealerIndex = (nextRoundNumber - 1) % sortedPlayers.length;
    return sortedPlayers[nextDealerIndex];
  };

  const nextDealer = getNextDealer();
  const nextRoundNumber = roundNumber + 1;
  const nextCardCount = 6 + nextRoundNumber; // Cartas para la próxima ronda


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          Puntuaciones Mano {roundNumber}: {getRoundDescription(roundNumber)}
        </CardTitle>
      </CardHeader>
      {nextDealer && nextRoundNumber <= 7 && (
        <div className="mt-2 text-center mb-4">
          <Badge variant="outline" className="bg-green-50 text-green-800 mr-2">
            Próximo repartidor: {nextDealer.name}
          </Badge>
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
            {nextCardCount} cartas
          </Badge>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="space-y-2">
              <Label htmlFor={`player-${player.id}`}>{player.name}</Label>
              <Input
                id={`player-${player.id}`}
                type="number"
                value={scores[player.id]}
                onChange={(e) => handleScoreChange(player.id, e.target.value)}
                placeholder="Puntos"
                required
                disabled={isLoading}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Guardar Puntuaciones
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}