import { MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export type BranchType = string | null;

const branches = [
  { id: "baku", name: "Bakı", icon: "🏙️", gradient: "from-blue-500 to-cyan-400" },
  { id: "ganja", name: "Gəncə", icon: "🌆", gradient: "from-purple-500 to-pink-400" },
  { id: "sumgait", name: "Sumqayıt", icon: "🏭", gradient: "from-slate-500 to-zinc-400" },
  { id: "mingachevir", name: "Mingəçevir", icon: "⚡", gradient: "from-yellow-500 to-orange-400" },
  { id: "shirvan", name: "Şirvan", icon: "🌾", gradient: "from-green-500 to-emerald-400" },
  { id: "lankaran", name: "Lənkəran", icon: "🌊", gradient: "from-teal-500 to-cyan-400" },
  { id: "shaki", name: "Şəki", icon: "🏔️", gradient: "from-indigo-500 to-blue-400" },
  { id: "quba", name: "Quba", icon: "🍎", gradient: "from-red-500 to-rose-400" },
];

interface BranchSelectorProps {
  onBranchSelect: (branch: BranchType) => void;
  selectedBranch: BranchType;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export const BranchSelector = ({ onBranchSelect, selectedBranch }: BranchSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl space-y-8"
    >
      {/* Header Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 shadow-lg"
        >
          <MapPin className="w-10 h-10 text-primary" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
            Hansı bölgədənsən?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Sorğunu göndərmək üçün bölgəni seç
          </p>
        </motion.div>
      </div>

      {/* Branch Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
      >
        {branches.map((branch) => {
          const isSelected = selectedBranch === branch.id;
          
          return (
            <motion.button
              key={branch.id}
              variants={itemVariants}
              onClick={() => onBranchSelect(branch.id)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`
                group relative p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 overflow-hidden
                ${isSelected 
                  ? "border-primary bg-primary/10 shadow-xl shadow-primary/20" 
                  : "border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg"
                }
              `}
            >
              {/* Background Gradient Overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${branch.gradient} opacity-0 
                transition-opacity duration-500
                ${isSelected ? "opacity-15" : "group-hover:opacity-10"}
              `} />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
              </div>

              <div className="relative flex flex-col items-center gap-4">
                <motion.span
                  animate={isSelected ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl drop-shadow-lg"
                >
                  {branch.icon}
                </motion.span>
                <span className={`
                  font-bold text-lg md:text-xl transition-all duration-300
                  ${isSelected 
                    ? "text-primary scale-105" 
                    : "text-foreground group-hover:text-primary"
                  }
                `}>
                  {branch.name}
                </span>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Footer Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-muted-foreground"
      >
        Seçdiyiniz bölgə yalnız statistika üçün istifadə olunur
      </motion.p>
    </motion.div>
  );
};
