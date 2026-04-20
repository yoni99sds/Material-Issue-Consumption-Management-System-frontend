import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Bot, Sparkles, Loader2 } from "lucide-react";

export default function AIAssistantPage() {
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleAsk = async () => {
    if (!input.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsTyping(true);
    
    // Simulate AI Response
    setTimeout(() => {
      let response = "I'm analyzing the production data. Could you please provide more specific details about the machine or work order?";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes("waste")) {
        response = "Waste levels are currently exceeding the acceptable threshold (8.2% vs target 5%). I recommend checking the slitting precision on Machine EX-01.";
      } else if (lowerInput.includes("efficiency")) {
        response = "Current overall efficiency is 94.2%. Night shift on EX-02 showed a 4% improvement after the recent maintenance.";
      } else if (lowerInput.includes("inventory")) {
        response = "Stock for 'Material M-10293' is low. Estimated depletion in 48 hours based on current work orders.";
      }

      toast.info(response, {
        icon: <Sparkles className="text-cyan-400" size={18} />,
        duration: 8000,
      });
      
      setIsTyping(false);
      setInput("");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-zinc-800 mb-6 shadow-lg shadow-purple-500/10">
          <Bot size={40} className="text-purple-400" />
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Production AI Assistant</h2>
        <p className="text-zinc-500 text-lg">Ask about production metrics, waste analysis, or inventory levels.</p>
      </div>

      <Card className="bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden">
        <CardHeader className="bg-zinc-900/50 border-b border-zinc-800">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles size={20} className="text-cyan-400" />
            New Inquiry
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-10 space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-400 ml-1">Your Question</label>
            <Textarea
              className="bg-black border-zinc-800 text-white min-h-[160px] p-6 text-lg rounded-2xl focus-visible:ring-purple-500/30"
              placeholder="e.g. Why is the waste level high for today's shift?"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleAsk}
            disabled={isTyping || !input.trim()}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-[0.98]"
          >
            {isTyping ? <Loader2 size={24} className="animate-spin" /> : "Ask AI"}
          </Button>
          
          <div className="flex items-center justify-center gap-6 text-zinc-600 text-xs font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Waste Analysis</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" /> Efficiency</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Stock</span>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center text-[10px] text-zinc-700 mt-12 uppercase tracking-widest font-bold">
        Secure Industrial Intelligence Node • 0X-99
      </p>
    </div>
  );
}