'use client';

import { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, Trash2, BarChart2, Eye } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

// Mock data for strategies
const mockStrategies = [
  { id: 'S001', name: 'Simple Moving Average Crossover', description: 'Buy when 50-day MA crosses above 200-day MA.', status: 'active', performance: '+15.2%' },
  { id: 'S002', name: 'RSI Momentum', description: 'Buy on RSI dip below 30, sell on rise above 70.', status: 'paused', performance: '+8.1%' },
  { id: 'S003', name: 'Bollinger Band Breakout', description: 'Trade breakouts above/below Bollinger Bands.', status: 'active', performance: '-2.5%' },
  { id: 'S004', name: 'MACD Signal Cross', description: 'Follow MACD line crossing signal line.', status: 'inactive', performance: '+5.0%' },
];

// Mock API functions (replace with actual API calls)
const toggleStrategyStatus = async (id: string, currentStatus: string) => {
  console.log(`Toggling status for strategy ${id} from ${currentStatus}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
   return { success: true, newStatus: currentStatus === 'active' ? 'paused' : 'active' };
 // return { success: false, message: "Failed to update status" }; // Simulate failure
};

const deleteStrategy = async (id: string) => {
    console.log(`Deleting strategy ${id}`);
    await new Promise(resolve => setTimeout(resolve, 800));
     return { success: true, message: `Strategy ${id} deleted.` };
    // return { success: false, message: "Failed to delete strategy" };
}


export function StrategyList() {
  const [strategies, setStrategies] = useState(mockStrategies);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({}); // Track loading state per strategy

  const handleToggle = async (id: string, currentStatus: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    try {
        const result = await toggleStrategyStatus(id, currentStatus);
        if(result.success) {
            setStrategies(prev => prev.map(s => s.id === id ? { ...s, status: result.newStatus } : s));
             toast({ title: "Status Updated", description: `Strategy ${id} is now ${result.newStatus}.` });
        } else {
             toast({ title: "Update Failed", description: (result as any).message || "Could not update strategy status.", variant: "destructive" });
        }

    } catch (error: any) {
         toast({ title: "Error", description: error.message || "An error occurred.", variant: "destructive" });
    } finally {
        setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

   const handleDelete = async (id: string) => {
       setLoadingStates(prev => ({ ...prev, [`delete-${id}`]: true }));
       try {
           const result = await deleteStrategy(id);
            if (result.success) {
               setStrategies(prev => prev.filter(s => s.id !== id));
               toast({ title: "Strategy Deleted", description: result.message });
            } else {
               toast({ title: "Delete Failed", description: (result as any).message || "Could not delete strategy.", variant: "destructive" });
            }
       } catch (error: any) {
            toast({ title: "Error", description: error.message || "An error occurred.", variant: "destructive" });
       } finally {
            setLoadingStates(prev => ({ ...prev, [`delete-${id}`]: false }));
       }
   }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case 'inactive': return <Badge variant="outline">Inactive</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Performance</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {strategies.length === 0 && (
             <TableRow>
                 <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                    No strategies added yet.
                 </TableCell>
             </TableRow>
        )}
        {strategies.map((strategy) => (
          <TableRow key={strategy.id}>
            <TableCell className="font-medium">{strategy.name}</TableCell>
            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{strategy.description}</TableCell>
            <TableCell>{getStatusBadge(strategy.status)}</TableCell>
            <TableCell className={`text-right font-medium ${strategy.performance.startsWith('+') ? 'text-green-600' : strategy.performance.startsWith('-') ? 'text-red-600' : ''}`}>
              {strategy.performance}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                 <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => handleToggle(strategy.id, strategy.status)}
                     disabled={loadingStates[strategy.id] || strategy.status === 'inactive'}
                     title={strategy.status === 'active' ? 'Pause Strategy' : 'Activate Strategy'}
                    className="h-7 w-7"
                 >
                    {strategy.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                 </Button>
                  {/* Placeholder for View/Analyze Button */}
                  <Button variant="ghost" size="icon" title="View Details" className="h-7 w-7">
                     <Eye className="h-4 w-4" />
                  </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button
                             variant="ghost"
                             size="icon"
                             className="text-red-600 hover:text-red-700 hover:bg-red-100 h-7 w-7"
                             title="Delete Strategy"
                             disabled={loadingStates[`delete-${strategy.id}`]}
                           >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the strategy "{strategy.name}".
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel disabled={loadingStates[`delete-${strategy.id}`]}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDelete(strategy.id)}
                            disabled={loadingStates[`delete-${strategy.id}`]}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                           >
                            {loadingStates[`delete-${strategy.id}`] ? "Deleting..." : "Delete"}
                         </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
       <TableCaption>Your configured automated trading strategies.</TableCaption>
    </Table>
  );
}
