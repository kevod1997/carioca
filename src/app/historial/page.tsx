export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Historial de Partidas',
    description: 'Consulta el historial completo de partidas de Carioca y sus resultados',
  };

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
import { Badge } from "@/components/ui/badge";
import { NavigateButton } from "@/components/ui/navigate-button";

export default async function HistoryPage() {
    const games = await prisma.game.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            gameParticipants: {
                include: { player: true }
            },
            winner: true
        },
    });

    return (
        <main className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Historial de Partidas</h1>
                <NavigateButton href="/" variant="outline">
                    Volver al inicio
                </NavigateButton>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Todas las partidas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Jugadores</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {games.map((game) => (
                                <TableRow key={game.id}>
                                    <TableCell className="font-medium">
                                        {game.name || `Partida del ${new Date(game.createdAt).toLocaleDateString()}`}
                                    </TableCell>
                                    <TableCell>{new Date(game.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {game.gameParticipants.map(p => p.player.name).join(", ")}
                                    </TableCell>
                                    <TableCell>
                                        {!game.isActive ? (
                                            <>
                                                <Badge variant="outline" className="bg-gray-100">
                                                    Completada
                                                </Badge>
                                                {game.winner && (
                                                    <p className="mt-1 text-sm text-green-600">
                                                        Ganador: {game.winner.name}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                Activa
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <NavigateButton href={`/partidas/${game.id}`} variant="ghost" size="sm">
                                                Ver detalles
                                        </NavigateButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}