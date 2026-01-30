import { motion } from "framer-motion";
import { SoccerBall } from "@/components/icons/SoccerBall";

interface HeaderProps {
  playerName: string;
  month: string;
}

export function Header({ playerName, month }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative pitch-pattern rounded-b-3xl py-6 px-4 overflow-hidden"
    >
      {/* Pitch lines decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="flex items-center justify-center gap-2 mb-2"
        >
          <SoccerBall size={24} className="text-white animate-bounce-slow" />
          <h1 className="font-display text-2xl sm:text-3xl text-white tracking-wider drop-shadow-lg">
            MESADA DO VOZÃO
          </h1>
          <SoccerBall size={24} className="text-white animate-bounce-slow" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-white/80 text-sm"
        >
          <span className="font-semibold">⚽ {playerName}</span>
          <span className="text-white/50">•</span>
          <span className="capitalize">{month} 2024</span>
        </motion.div>
      </div>
    </motion.header>
  );
}
