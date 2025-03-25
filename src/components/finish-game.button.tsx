// src/components/finish-game-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type FinishGameButtonProps = {
  gameId: number;
};

export function FinishGameButton({ gameId }: FinishGameButtonProps) {
  const router = useRouter();

  const handleFinishGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}/finish`, {
        method: "POST",
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        console.error("Error al finalizar el juego");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Button className="mt-4" onClick={handleFinishGame}>
      Finalizar Partida
    </Button>
  );
}