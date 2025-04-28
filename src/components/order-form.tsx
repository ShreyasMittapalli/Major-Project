'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast"; // Assuming useToast hook exists
import { useState } from 'react';

// Zod schema for form validation
const orderFormSchema = z.object({
  ticker: z.string().min(1, "Ticker is required").max(10, "Ticker symbol too long"),
  orderType: z.enum(["buy", "sell"]),
  quantity: z.coerce.number().int().positive("Quantity must be a positive whole number"),
  priceType: z.enum(["market", "limit"]),
  limitPrice: z.coerce.number().optional(),
}).refine(data => {
  if (data.priceType === "limit") {
    return data.limitPrice !== undefined && data.limitPrice > 0;
  }
  return true;
}, {
  message: "Limit price is required for limit orders and must be positive",
  path: ["limitPrice"], // Specify the path of the error
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

// Mock function to simulate placing an order  (This will be replaced by backend interaction)
// const placeOrder = async (data: OrderFormValues) => { ... };


export function OrderForm() {
   const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      ticker: "",
      orderType: "buy",
      quantity: 1, // Default quantity
      priceType: "market",
      limitPrice: undefined,
    },
  });

  const priceType = form.watch("priceType"); // Watch the priceType field

  // Mock stock data service (Replace with actual implementation)
  const stockDataService = {
    getStockData: async (ticker: string) => {
      // Replace with actual API call to get stock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      return { ticker, price: Math.random() * 200 + 50 }; // Simulate price
    },
  };


  async function onSubmit(data: OrderFormValues) {
    setIsSubmitting(true);
    try {
      const stockData = await stockDataService.getStockData(data.ticker);
      const price = data.priceType === 'market' ? stockData.price : data.limitPrice!;

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: data.ticker,
          type: data.orderType,
          quantity: data.quantity,
          price,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast({
        title: "Order Executed",
        description: `Successfully ${data.orderType} ${data.quantity} shares of ${data.ticker} at $${price.toFixed(2)}`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ticker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticker Symbol</FormLabel>
              <FormControl>
                {/* TODO: Consider making this a searchable select or autocomplete */}
                <Input placeholder="e.g., AAPL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orderType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Order Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="buy" />
                    </FormControl>
                    <FormLabel className="font-normal text-green-600">
                      Buy
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="sell" />
                    </FormControl>
                    <FormLabel className="font-normal text-red-600">
                      Sell
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10" {...field} min="1" step="1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select order price type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Market orders execute at the best available price. Limit orders execute only at your specified price or better.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {priceType === "limit" && (
          <FormField
            control={form.control}
            name="limitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limit Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 175.00" {...field} min="0.01" step="0.01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Executing Order..." : "Execute Order"}
        </Button>
      </form>
    </Form>
  );
}