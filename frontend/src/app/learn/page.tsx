import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { learningModules } from "@/lib/mock-data";
import { BookMarked } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Learning Center</h1>
        <p className="text-muted-foreground">Master the arena. Complete modules to earn rewards.</p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {learningModules.map((module) => (
          <AccordionItem value={module.id} key={module.id}>
            <AccordionTrigger className="font-headline text-lg hover:no-underline">
              <div className="flex items-center gap-3">
                <BookMarked className="w-6 h-6 text-primary" />
                {module.title}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-2">
              <p className="text-muted-foreground">{module.content}</p>
              <Button variant="outline" className="font-headline">Mark as Completed & Claim XP</Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
