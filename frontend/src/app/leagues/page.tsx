'use client'
import { LeagueTrophyCard } from "@/components/league-trophy-card";
import { leagues } from "@/lib/mock-data";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function LeaguesPage() {
  // Mock user ELO. In a real app, this would come from user data.
  const userElo = 1500;

  return (
    <div className="relative flex flex-col h-full w-full items-center justify-center p-4 overflow-hidden">
       <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-background via-background/80 to-transparent z-0"/>
      <div className="z-10 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Leagues</h1>
        <p className="text-muted-foreground mt-2">
          Test your skills and climb the ranks. Your current ELO is{" "}
          <span className="text-accent font-bold font-headline">{userElo}</span>.
        </p>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-sm md:max-w-xl lg:max-w-4xl"
      >
        <CarouselContent>
          {leagues.map((league) => (
            <CarouselItem key={league.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <LeagueTrophyCard league={league} userElo={userElo} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-foreground -left-4 md:-left-8"/>
        <CarouselNext className="text-foreground -right-4 md:-right-8"/>
      </Carousel>
    </div>
  );
}
