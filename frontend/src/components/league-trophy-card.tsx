'use client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import Trophy3D from "./trophy-3d";

type LeagueTrophyCardProps = {
  league: {
    id: string;
    name: string;
    elo_min: number;
    elo_max: number;
    entry_fee: number;
    rewards: string;
  };
  userElo: number;
};

export function LeagueTrophyCard({ league, userElo }: LeagueTrophyCardProps) {
  const isEligible = userElo >= league.elo_min;

  const leagueConfig = {
    "Bronze League": {
      color: "hsl(28, 70%, 50%)",
      glaze: "from-amber-600/20",
      geometry: "box"
    },
    "Silver League": {
      color: "hsl(240, 5%, 75%)",
      glaze: "from-slate-300/20",
      geometry: "sphere"
    },
    "Gold League": {
      color: "hsl(45, 80%, 60%)",
      glaze: "from-yellow-400/20",
      geometry: "cylinder"
    },
    "Diamond League": {
      color: "hsl(190, 80%, 60%)",
      glaze: "from-cyan-400/20",
      geometry: "torus"
    },
  }[league.name] || {
    color: "hsl(0, 0%, 80%)",
    glaze: "from-gray-400/20",
    geometry: "box"
  };

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between rounded-3xl border border-white/10 bg-black/20 p-6 text-white backdrop-blur-xl transition-all duration-300 hover:border-white/20",
      )}
    >
      <div className={cn("absolute inset-0 rounded-3xl bg-gradient-to-br via-transparent to-transparent", leagueConfig.glaze)} />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
            <h2 className={cn("font-headline text-2xl font-bold")} style={{ color: leagueConfig.color }}>{league.name}</h2>
            <Badge variant="outline" style={{ borderColor: leagueConfig.color, color: leagueConfig.color }}>{league.rewards}</Badge>
        </div>

        <div className="flex-grow flex items-center justify-center my-4 h-36">
            <Trophy3D shape={leagueConfig.geometry as any} color={leagueConfig.color} />
        </div>

        <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-white/50"/>
                <p>Required ELO: <span className="font-bold font-headline">{league.elo_min}+</span></p>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-white/50"/>
                <p>Entry Fee: <span className="font-bold font-headline">{league.entry_fee > 0 ? `${league.entry_fee} $FLXN` : "Free"}</span></p>
            </div>
        </div>

        <Button 
            className="w-full font-headline mt-6" 
            disabled={!isEligible}
            style={isEligible ? { backgroundColor: leagueConfig.color, color: 'black' } : {}}
            variant={isEligible ? 'default' : 'secondary'}
        >
            {isEligible ? "Join League" : `Needs ELO >= ${league.elo_min}`}
        </Button>
      </div>
    </div>
  );
}
