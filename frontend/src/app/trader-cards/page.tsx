
import { TraderCard } from "@/components/trader-card";
import { traders } from "@/lib/mock-data";

export default function TraderCardsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Your Trader Cards</h1>
        <p className="text-muted-foreground">Manage your collection of unique trader NFTs.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {traders.map((trader) => (
          <div key={trader.owner} className="aspect-[0.718]">
            <TraderCard trader={trader} />
          </div>
        ))}
      </div>
    </div>
  );
}

    