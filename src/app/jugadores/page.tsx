// src/app/players/page.tsx (versión optimizada)
import { prisma } from "@/lib/db";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigateButton } from "@/components/ui/navigate-button";

export default async function PlayersPage() {
    // Obtener jugadores con estadísticas ya calculadas
    const players = await prisma.player.findMany({
        orderBy: {
            name: "asc",
        },
    });

    // Procesar estadísticas
    const playerStats = players.map(player => {
        // Calcular porcentaje de victorias
        const victoryPercentage = player.completedGames > 0
            ? Math.round((player.totalVictories / player.completedGames) * 100)
            : 0;

        // Calcular puntos promedio por partida
        const avgPointsPerGame = player.completedGames > 0
            ? Math.round(player.totalPoints / player.completedGames)
            : 0;

        return {
            id: player.id,
            name: player.name,
            totalGames: player.totalGames,
            completedGames: player.completedGames,
            victories: player.totalVictories,
            victoryPercentage,
            avgPointsPerGame,
        };
    });

    return (
        <main className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Estadísticas de Jugadores</h1>
                <NavigateButton href="/" variant="outline">
                    Volver al inicio
                </NavigateButton>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Jugadores registrados</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Partidas</TableHead>
                                <TableHead>Completadas</TableHead>
                                <TableHead>Victorias</TableHead>
                                <TableHead>% Victoria</TableHead>
                                <TableHead>Prom. pts/partida</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {playerStats.map((player) => (
                                <TableRow key={player.id}>
                                    <TableCell className="font-medium">{player.name}</TableCell>
                                    <TableCell>{player.totalGames}</TableCell>
                                    <TableCell>{player.completedGames}</TableCell>
                                    <TableCell>{player.victories}</TableCell>
                                    <TableCell>{player.victoryPercentage}%</TableCell>
                                    <TableCell>{player.avgPointsPerGame}</TableCell>
                                </TableRow>
                            ))}
                            {playerStats.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        No hay jugadores registrados aún
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}