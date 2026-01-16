import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card3D } from "@/components/ui/Card3D";
import { api } from "@/lib/mockServer";
import { cn } from "@/utils/cn";

export function CallingView() {
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ role: "ai" | "guest"; text: string }>>([
    { role: "ai", text: "Good evening! This is the Aurum AI Dining Coordinator. How may I assist you today?" },
  ]);
  const [inputText, setInputText] = useState("");
  const [rooms] = useState([
    { number: "101", primaryGuest: "Alex Morgan" },
    { number: "102", primaryGuest: "Sophia Chen" },
    { number: "203", primaryGuest: "Marcus Rodriguez" },
    { number: "305", primaryGuest: "Fatima Al-Khaldi" },
    { number: "401", primaryGuest: "Rajesh Patel" }
  ]);
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0].number);
  const [currentOrder, setCurrentOrder] = useState<any>({
    id: "O-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
    roomNumber: selectedRoom,
    guestName: rooms.find(r => r.number === selectedRoom)?.primaryGuest ?? "Guest",
    status: "new",
    items: [],
    createdAt: Date.now(),
    eta: Date.now() + 30 * 60 * 1000,
    total: 0,
    specialInstructions: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const ttsRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Pre-resolved menu items for calling view
  const menuItems = [
    { id: "MI-001", name: "Beef Wellington", price: 55, description: "Tender beef wrapped in puff pastry with mushroom duxelles", dietary: [], allergens: ["gluten", "dairy"] },
    { id: "MI-002", name: "Lamb Tagine (Halal)", price: 38, description: "Slow-cooked spiced lamb tagine served with couscous", dietary: ["halal"], allergens: ["gluten"] },
    { id: "MI-003", name: "Roasted Cauliflower Steak", price: 28, description: "Large cauliflower steak with romesco sauce and herbs", dietary: ["vegan", "vegetarian"], allergens: [] },
    { id: "MI-004", name: "Grilled Halibut", price: 42, description: "Fresh halibut fillet with lemon butter sauce and asparagus", dietary: [], allergens: ["dairy"] }
  ];

  // Helper: TTS speak
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      ttsRef.current = new SpeechSynthesisUtterance(text);
      ttsRef.current.lang = "en-GB";
      ttsRef.current.rate = 0.95;
      ttsRef.current.pitch = 1;
      window.speechSynthesis.speak(ttsRef.current);
    }
  };

  // Connect / Disconnect
  const toggleCall = () => {
    if (!isConnected) {
      setIsConnected(true);
      setTranscript([
        { role: "ai", text: `Good evening from room ${selectedRoom}! This is the Aurum AI Dining Coordinator. How may I help you today?` },
      ]);
    } else {
      setIsConnected(false);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }
  };

  // Process Guest Input
  const handleSend = async (text: string = inputText.trim()) => {
    if (!text || !isConnected) return;

    setIsProcessing(true);
    setInputText("");

    // Add guest's message
    setTranscript(prev => [...prev, { role: "guest", text }]);

    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 800));

    // AI Response & Order Logic
    const response = await getAIResponse(text, selectedRoom, menuItems, currentOrder);
    setTranscript(prev => [...prev, { role: "ai", text: response.text }]);
    setCurrentOrder(response.updatedOrder);
    speak(response.text);
    setIsProcessing(false);
  };

  // Helper: Call AI Logic
  const getAIResponse = async (msg: string, roomNum: string, menu: MenuItem[], order: Order) => {
    const lowerMsg = msg.toLowerCase();
    const roomGuest = rooms.find(r => r.number === roomNum)?.primaryGuest ?? "Guest";

    // Match menu item by name
    let matchedItem: MenuItem | null = null;
    for (const item of menu) {
      if (lowerMsg.includes(item.name.toLowerCase().replace(/[^a-z0-9 ]/g, ""))) {
        matchedItem = item;
        break;
      }
    }

    if (matchedItem) {
      const existing = order.items.find(i => i.itemId === matchedItem.id);
      let updatedItems = [...order.items];

      if (existing) {
        existing.qty += 1;
      } else {
        updatedItems.push({
          itemId: matchedItem.id,
          name: matchedItem.name,
          price: matchedItem.price,
          qty: 1,
          modifiers: lowerMsg.includes("no cheese") || lowerMsg.includes("without cheese") ? ["No Cheese"] : []
        });
      }

      const newTotal = updatedItems.reduce((sum, i) => sum + i.price * i.qty, 0) * 1.12;

      return {
        text: `Perfect! I've added ${matchedItem.name} to your order. Would you like anything else?`,
        updatedOrder: {
          ...order,
          items: updatedItems,
          total: parseFloat(newTotal.toFixed(2)),
        }
      };
    }

    if (lowerMsg.includes("halal")) {
      return {
        text: "We have several halal options available, including the Lamb Tagine and Grilled Chicken Skewers. Would you like me to add one of those?",
        updatedOrder: order,
      };
    }

    if (lowerMsg.includes("order")) {
      return {
        text: `Your order totals £${order.total.toFixed(2)} with service charge. It will be ready in about 35 minutes. Would you like me to confirm it for room ${roomNum}?`,
        updatedOrder: order,
      };
    }

    if (lowerMsg.includes("confirm")) {
      api.createOrder(order);
      return {
        text: "Order confirmed! Your order ID is " + order.id + ". Thank you for choosing Aurum Dining.",
        updatedOrder: { ...order, status: "in_kitchen" } as Order,
      };
    }

    if (lowerMsg.includes("cancel")) {
      return {
        text: "Your order has been cancelled. Is there anything else I can help with?",
        updatedOrder: {
          ...order,
          items: [],
          total: 0,
        }
      };
    }

    return {
      text: "I can help you browse our menu, place an order, or check the status of your order. What would you like to do?",
      updatedOrder: order,
    };
  };

  // Keyboard shortcuts
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.shiftKey === false) {
        handleSend();
      }
      if (e.key.toLowerCase() === "c" && e.altKey) {
        toggleCall();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [inputText, isConnected]);


  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Left: Call UI & Order */}
      <div className="grid gap-4">
        <h3 className="text-xs uppercase tracking-[0.35em] text-emerald-400/70 font-semibold mb-2">Voice & Text Call</h3>
        <Card3D className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900 border-white/10">
          <div className="grid gap-4">
            {/* Call Control */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <span className={cn("w-2.5 h-2.5 rounded-full", isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-500")} />
                Room Landline: {selectedRoom} • <span className="text-sm font-normal text-emerald-300/80">English (UK)</span>
              </h4>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="secondary" className="rounded-full"
                  onClick={() => setSelectedRoom(prev => rooms.find(r => r.number !== prev)?.number ?? rooms[0].number)}
                >
                  Random Room
                </Button>
                <Button size="md"
                  variant={isConnected ? "danger" : "primary"}
                  onClick={toggleCall}
                  className="px-6 rounded-full"
                >
                  {isConnected ? "End Call" : "Start Call"}
                </Button>
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 max-h-[420px] overflow-y-auto space-y-3">
              {transcript.map((line, idx) => (
                <div key={idx} className={cn("flex gap-3", line.role === "ai" ? "justify-start" : "justify-end")}>
                  <span className={cn(
                    "px-4 py-2 rounded-2xl text-sm leading-relaxed",
                    line.role === "ai"
                      ? "bg-gradient-to-r from-slate-800 to-slate-800 text-slate-100 border border-white/10"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-500/30 shadow-lg"
                  )}>
                    <span className="font-semibold mr-1 text-xs uppercase opacity-80">{line.role === "ai" ? "Aurum AI" : rooms.find(r => r.number === selectedRoom)?.primaryGuest}</span>
                    {line.text}
                  </span>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-slate-400 animate-pulse">
                  <span className="text-emerald-400 font-semibold">AI</span> is thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="grid gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isConnected ? "Ask for menu items, dietary options, or place an order..." : "Connect call first"}
                  disabled={!isConnected || isProcessing}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!isConnected || !inputText || isProcessing}
                >
                  Send
                </Button>
                <Button
                  variant="secondary"
                  className="bg-gradient-to-r from-purple-700 to-indigo-700"
                  disabled={!isConnected}
                >
                  🎤 Voice
                </Button>
              </div>
              <p className="text-[11px] text-slate-500">
                Tip: Try "Add the Beef Wellington", "I'd like a halal option", "Confirm order", or press Enter to send.
              </p>
            </div>
          </div>
        </Card3D>
      </div>


      {/* Right: Order Summary */}
      <div className="grid gap-4">
        <h3 className="text-xs uppercase tracking-[0.35em] text-emerald-400/70 font-semibold mb-2">Current Order</h3>
        <Card3D className="bg-slate-900 border-white/10">
          <div className="grid gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span className="text-yellow-400">🧾</span> Order {currentOrder.id}
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                currentOrder.status === "new" ? "bg-blue-500/20 text-blue-300 border-blue-400/30" :
                "bg-orange-500/20 text-orange-300 border-orange-400/30"
              )}>
                {currentOrder.status.toUpperCase().replaceAll("_", " ")}
              </span>
            </div>

            {/* Items */}
            <div className="grid gap-3">
              {currentOrder.items.length > 0 ? (
                currentOrder.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-900/60 rounded-xl px-3 py-2 border border-white/5">
                    <span className="text-sm text-slate-200 flex items-center gap-2">
                      <span className="text-emerald-400 font-semibold">{item.quantity}x</span> {item.name}
                    </span>
                    <span className="text-sm font-semibold text-amber-300">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic px-2 py-4">No items yet. Ask for something from the menu!</p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 pt-3 space-y-3">
              <div className="flex justify-between items-center text-sm text-slate-300">
                <span>Subtotal</span>
                <span>£{currentOrder.total > 0 ? (currentOrder.total / 1.12).toFixed(2) : "0.00"}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-300">
                <span>Service charge (12%)</span>
                <span>£{currentOrder.total > 0 ? (currentOrder.total - (currentOrder.total / 1.12)).toFixed(2) : "0.00"}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold text-yellow-300 bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-3 py-2 rounded-xl border border-yellow-500/30">
                <span>Total to pay</span>
                <span>£{currentOrder.total.toFixed(2)}</span>
              </div>

              <Button className="w-full" variant="primary" size="md"
                disabled={currentOrder.items.length === 0}
                onClick={() => {
                  setTranscript(prev => [...prev, { role: "guest", text: "Confirm order" }, { role: "ai", text: "Order confirmed! Thank you." }]);
                  api.createOrder(currentOrder);
                }}
              >
                Send to POS • Oracle Micros
              </Button>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
}
