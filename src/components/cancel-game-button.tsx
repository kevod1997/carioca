// src/components/cancel-game-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type CancelGameButtonProps = {
  gameId: number;
};

export function CancelGameButton({ gameId }: CancelGameButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleCancelGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/games/${gameId}/cancel`, {
        method: "POST",
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Error al cancelar la partida");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al cancelar la partida");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="text-destructive border-destructive hover:bg-destructive/10" 
        onClick={() => setShowConfirmDialog(true)}
      >
        Cancelar Partida
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar esta partida?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la partida y todas sus puntuaciones.
              Los contadores de partidas de los jugadores serán ajustados.
              Esta acción no puede deshacerse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelGame}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Cancelando..." : "Sí, cancelar partida"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}