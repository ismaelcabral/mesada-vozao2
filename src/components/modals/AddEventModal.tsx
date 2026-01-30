import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (type: 'yellow' | 'red', reason: string) => void;
  onAddGoal: (type: 'goal' | 'double-goal', reason: string) => void;
}

type EventCategory = 'yellow' | 'red' | 'goal' | 'double-goal';

const EVENT_OPTIONS: { category: EventCategory; label: string; emoji: string; description: string }[] = [
  { category: 'goal', label: 'Gol', emoji: '⚽', description: '+R$ 5' },
  { category: 'double-goal', label: 'Gol Duplo', emoji: '⚽⚽', description: '+R$ 10' },
  { category: 'yellow', label: 'Amarelo', emoji: '🟨', description: '-R$ 5' },
  { category: 'red', label: 'Vermelho', emoji: '🟥', description: '-R$ 15' },
];

export function AddEventModal({ isOpen, onClose, onAddCard, onAddGoal }: AddEventModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!selectedCategory || !reason.trim()) return;

    if (selectedCategory === 'yellow' || selectedCategory === 'red') {
      onAddCard(selectedCategory, reason);
    } else {
      onAddGoal(selectedCategory, reason);
    }

    setSelectedCategory(null);
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setReason("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-6 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl tracking-wide">NOVO EVENTO</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {EVENT_OPTIONS.map((option) => (
                <motion.button
                  key={option.category}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(option.category)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    selectedCategory === option.category
                      ? option.category.includes('goal')
                        ? "border-goal bg-goal/20"
                        : option.category === 'yellow'
                          ? "border-yellow-card bg-yellow-card/20"
                          : "border-red-card bg-red-card/20"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className={cn(
                    "text-xs font-bold",
                    option.category.includes('goal') ? "text-goal" : "text-red-card"
                  )}>
                    {option.description}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Motivo
              </label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Arrumou o quarto sem pedir"
                className="bg-muted border-border"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!selectedCategory || !reason.trim()}
              className="w-full h-12 font-display text-lg tracking-wide bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              REGISTRAR
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
