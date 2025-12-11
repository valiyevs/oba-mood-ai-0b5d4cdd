import { CheckCircle2, Shield, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface SuccessScreenProps {
  onComplete: () => void;
}

const confettiColors = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-orange-500",
];

export const SuccessScreen = ({ onComplete }: SuccessScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full max-w-md space-y-8 text-center"
    >
      {/* Confetti Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 400 - 200,
              y: -20,
              rotate: 0,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: 500,
              rotate: Math.random() * 720 - 360,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 0.5,
              ease: "easeOut",
            }}
            className={`absolute w-3 h-3 rounded-sm ${confettiColors[i % confettiColors.length]}`}
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="relative mx-auto"
      >
        {/* Pulsing Background */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-green-500 blur-2xl"
        />
        
        {/* Icon Container */}
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
        >
          <CheckCircle2 className="w-16 h-16 text-white" />
        </motion.div>

        {/* Sparkles */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute -bottom-1 -left-3"
        >
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
          Təşəkkürlər!
        </h2>
        <p className="text-xl text-muted-foreground flex items-center justify-center gap-2">
          Rəyiniz uğurla qeydə alındı
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
        </p>
      </motion.div>

      {/* Privacy Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm p-6 shadow-lg"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px"
          }} />
        </div>

        <div className="relative space-y-3">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Shield className="w-6 h-6" />
            <span className="font-bold text-lg">Tam Məxfilik</span>
          </div>
          <p className="text-muted-foreground">
            Cavabınız tamamilə anonimdir və yalnız ümumi statistikada istifadə olunur.
          </p>
        </div>
      </motion.div>

      {/* Close Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onComplete}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
        >
          Bağla
        </Button>
      </motion.div>

      {/* Farewell Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-muted-foreground"
      >
        Görüşənədək! Sabah yenə qarşınızda olacağıq 👋
      </motion.p>
    </motion.div>
  );
};
