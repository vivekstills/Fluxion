
'use client';

import { Button } from '@/components/ui/button';
import { TraderCard } from '@/components/trader-card';
import { traders } from '@/lib/mock-data';
import FaultyTerminal from '@/components/faulty-terminal';
import Link from 'next/link';

export default function Dashboard() {
  const mainTrader = traders[0];

  return (
    <div className="flex flex-col h-full w-full items-center justify-between p-0 overflow-hidden relative">
      <div className="absolute inset-0 w-full h-full">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.3}
          pause={false}
          scanlineIntensity={0.1}
          glitchAmount={0.3}
          flickerAmount={0.2}
          noiseAmp={0.05}
          chromaticAberration={0.02}
          dither={0}
          curvature={0.1}
          tint="#8A2BE2"
          mouseReact={true}
          mouseStrength={0.3}
          pageLoadAnimation={true}
          brightness={0.8}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>


      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-sm md:max-w-xs z-10 px-4">
        <div className="w-full aspect-[0.718] my-4">
            <TraderCard trader={mainTrader} />
        </div>
      </main>

      {/* Footer Action */}
      <footer className="w-full flex flex-col items-center justify-center p-4 pb-8 z-10">
        <Button asChild className="font-headline text-xl md:text-2xl tracking-widest uppercase h-14 md:h-16 px-16 md:px-20 bg-primary hover:bg-primary/80 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-[0_0_20px_hsl(var(--primary))]">
          <Link href="/battle">Start Battle</Link>
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
            Where market mastery meets strategic combat.
        </p>
      </footer>
    </div>
  );
}
