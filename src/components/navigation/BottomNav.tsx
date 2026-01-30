import { motion } from "framer-motion";
import { Home, Calendar, Trophy, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddEvent: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'calendar', label: 'Histórico', icon: Calendar },
  { id: 'ranking', label: 'Ranking', icon: Trophy },
];

export function BottomNav({ activeTab, onTabChange, onAddEvent }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all",
                isActive ? "text-secondary" : "text-muted-foreground"
              )}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-secondary"
                />
              )}
            </button>
          );
        })}

        {/* Add Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onAddEvent}
          className="relative -mt-8 w-14 h-14 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-lg"
        >
          <Plus size={28} strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-20" />
        </motion.button>
      </div>
    </nav>
  );
}
