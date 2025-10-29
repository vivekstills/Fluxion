import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { leaderboardData } from "@/lib/mock-data";
import { Crown } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">See who's dominating the arena.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Global Rankings</CardTitle>
            <CardDescription>Top 10 players by ELO rating.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] font-headline">Rank</TableHead>
                    <TableHead className="font-headline">Player</TableHead>
                    <TableHead className="text-right font-headline">ELO</TableHead>
                    <TableHead className="text-right font-headline">Wins</TableHead>
                    <TableHead className="text-right font-headline">Losses</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {leaderboardData.map((player) => (
                    <TableRow key={player.rank}>
                    <TableCell className="font-medium font-headline flex items-center gap-2">
                        {player.rank === 1 && <Crown className="w-5 h-5 text-yellow-400"/>}
                        {player.rank === 2 && <Crown className="w-5 h-5 text-slate-300"/>}
                        {player.rank === 3 && <Crown className="w-5 h-5 text-amber-600"/>}
                        {player.rank}
                    </TableCell>
                    <TableCell className="font-semibold">{player.name}</TableCell>
                    <TableCell className="text-right font-bold text-accent font-headline">{player.elo}</TableCell>
                    <TableCell className="text-right text-green-400">{player.wins}</TableCell>
                    <TableCell className="text-right text-red-400">{player.losses}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
