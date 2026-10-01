import { useMemo } from "react";
import { motion } from "motion/react";

interface Star {
  left: number;
  top: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

// Vị trí sao cố định theo seed để không nhấp nháy lại mỗi lần render
function buildStars(count: number): Star[] {
  const colors = ["#ffffff", "#fde68a", "#a5f3fc", "#ddd6fe"];
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => ({
    left: rand() * 100,
    top: rand() * 100,
    size: rand() < 0.8 ? 1.5 : 3,
    color: colors[i % colors.length],
    duration: 2 + rand() * 4,
    delay: rand() * 4,
  }));
}

export function CosmicBackground({ density = 60 }: { density?: number }) {
  const stars = useMemo(() => buildStars(density), [density]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Tinh vân huyền bí */}
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        className="absolute -top-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-amber-500/20 blur-[110px]"
      />
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1.1, 1, 1.1] }}
        transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
        className="absolute top-1/3 -right-32 w-[26rem] h-[26rem] rounded-full bg-violet-600/25 blur-[110px]"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute -bottom-32 left-1/5 w-[24rem] h-[24rem] rounded-full bg-fuchsia-600/15 blur-[110px]"
      />

      {/* Bầu trời sao nhấp nháy */}
      {stars.map((s, i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ repeat: Infinity, duration: s.duration, delay: s.delay, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
          }}
        />
      ))}
    </div>
  );
}
