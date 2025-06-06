'use client';

import { useState, type ReactNode } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { generateTradingStrategy, type GenerateTradingStrategyInput, type GenerateTradingStrategyOutput } from '@/ai/flows/generate-trading-strategy'; // Import AI flow
import { Loader2 } from 'lucide-react';

// Zod schema for the strategy form
const strategyFormSchema = z.object({
  name: z.string().min(3, "Strategy name must be at least 3 characters").max(50),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  naturalLanguageAlgorithm: z.string().min(20, "Algorithm description needs more detail").max(1000),
});

type StrategyFormValues = z.infer<typeof strategyFormSchema>;

// Mock function to save the strategy (replace with actual API call)
const saveStrategy = async (data: StrategyFormValues & { mathematicalStrategy: string }) => {
  console.log("Saving strategy:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate success
   return { success: true, message: `Strategy "${data.name}" saved successfully!` };
  // Simulate failure
  // return { success: false, message: "Failed to save strategy." };
};

interface AddStrategyDialogProps {
    children: ReactNode; // To wrap the trigger button
}

export function AddStrategyDialog({ children }: AddStrategyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<string | null>(null);

  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      naturalLanguageAlgorithm: "",
    },
     mode: "onChange", // Validate on change for better UX
  });

  const handleGenerateStrategy = async () => {
    // Trigger validation before generating
     const isValid = await form.trigger(["naturalLanguageAlgorithm"]);
     if (!isValid) {
       toast({ title: "Validation Error", description: "Please provide a valid algorithm description.", variant: "destructive" });
       return;
     }

     const description = form.getValues("naturalLanguageAlgorithm");
    setIsGenerating(true);
    setGeneratedStrategy(null); // Clear previous generation

    try {
       const input: GenerateTradingStrategyInput = { algorithmDescription: description };
       const result: GenerateTradingStrategyOutput = await generateTradingStrategy(input);
       setGeneratedStrategy(result.mathematicalStrategy);
        toast({ title: "Strategy Generated", description: "Mathematical strategy generated by AI." });
    } catch (error: any) {
      console.error("Error generating strategy:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate strategy from description.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveStrategy = async () => {
     // Trigger validation before saving
     const isValid = await form.trigger(); // Validate all fields
     if (!isValid || !generatedStrategy) {
       toast({
           title: "Cannot Save",
           description: !generatedStrategy ? "Please generate the mathematical strategy first." : "Please fill in all required fields correctly.",
           variant: "destructive"
        });
       return;
     }

    setIsSaving(true);
    const formData = form.getValues();

    try {
        const result = await saveStrategy({ ...formData, mathematicalStrategy: generatedStrategy });
        if(result.success) {
            toast({ title: "Strategy Saved", description: result.message });
            setOpen(false); // Close dialog on success
            form.reset(); // Reset form
            setGeneratedStrategy(null);
            // TODO: Trigger a refresh of the strategy list on the parent page
        } else {
             toast({ title: "Save Failed", description: result.message, variant: "destructive" });
        }

    } catch (error: any) {
       console.error("Error saving strategy:", error);
        toast({
            title: "Save Error",
            description: error.message || "An unexpected error occurred while saving.",
            variant: "destructive",
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Trading Strategy</DialogTitle>
          <DialogDescription>
            Define your strategy using natural language, and let AI translate it into a mathematical model.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategy Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My Momentum Strategy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input placeholder="A brief overview of the strategy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="naturalLanguageAlgorithm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Algorithm Description (Natural Language)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your trading logic, e.g., 'Buy AAPL when its 50-day moving average crosses above the 200-day moving average. Sell when it crosses below.'"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide clear instructions for the AI to understand your trading rules.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="button" variant="outline" onClick={handleGenerateStrategy} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isGenerating ? "Generating..." : "Generate Mathematical Strategy (AI)"}
            </Button>

             {generatedStrategy && (
                 <FormItem>
                    <FormLabel>Generated Mathematical Strategy</FormLabel>
                    <FormControl>
                        <Textarea
                        readOnly
                        value={generatedStrategy}
                        className="min-h-[100px] bg-muted/50"
                        />
                    </FormControl>
                     <FormDescription>
                        Review the AI-generated strategy. You can regenerate if needed.
                    </FormDescription>
                </FormItem>
             )}

          </form>
        </Form>
        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving || isGenerating}>
             Cancel
          </Button>
          <Button type="button" onClick={handleSaveStrategy} disabled={!generatedStrategy || isSaving || isGenerating}>
             {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
             {isSaving ? "Saving..." : "Save Strategy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
