// src/components/score-table.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Player = {
  id: number;
  participantId?: number; // Añadimos esto para compatibility con el nuevo modelo
  name: string;
};

type Round = {
  id: number;
  roundNumber: number;
};

type Score = {
  playerId: number;
  roundId: number;
  value: number;
};

type ScoreTableProps = {
  players: Player[];
  rounds: Round[];
  scores: Score[];
};

export function ScoreTable({ players, rounds, scores }: ScoreTableProps) {
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

  // Obtener la puntuación para un jugador y una ronda
  const getScore = (playerId: number, roundId: number) => {
    const score = scores.find(
      (s) => s.playerId === playerId && s.roundId === roundId
    );
    return score ? score.value : "-";
  };

  // Calcular el total para un jugador
  const getPlayerTotal = (playerId: number) => {
    return scores
      .filter((s) => s.playerId === playerId)
      .reduce((sum, score) => sum + score.value, 0);
  };

  const getWinner = () => {
    const playerTotals: { [key: number]: number } = {};

    players.forEach(player => {
      playerTotals[player.id] = scores
        .filter(s => s.playerId === player.id)
        .reduce((sum, score) => sum + score.value, 0);
    });

    let minScore = Infinity;
    let winnerId = null;

    Object.entries(playerTotals).forEach(([playerId, total]) => {
      if (total < minScore) {
        minScore = total as number;
        winnerId = parseInt(playerId);
      }
    });

    return winnerId;
  };

  const winnerId = rounds.length === 7 ? getWinner() : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Puntuaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Mano</TableHead>
              {players.map((player) => (
                <TableHead key={player.id}>{player.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rounds.map((round) => (
              <TableRow key={round.id}>
                <TableCell className="font-medium">
                  {round.roundNumber}: {getRoundDescription(round.roundNumber)}
                </TableCell>
                {players.map((player) => (
                  <TableCell key={player.id}>
                    {getScore(player.id, round.id)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell>Total</TableCell>
              {players.map((player) => {
                const isWinner = winnerId === player.id;
                return (
                  <TableCell
                    key={player.id}
                    className={isWinner ? "bg-green-100 text-green-800" : ""}
                  >
                    {getPlayerTotal(player.id)}
                    {isWinner && rounds.length === 7 && (
                      <span className="ml-2 text-xs">👑 GANADOR</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}