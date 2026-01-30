import { motion } from 'framer-motion';

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl"
        style={{ top: '10%', left: '5%' }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-secondary/15 to-accent/15 blur-3xl"
        style={{ top: '50%', right: '0%' }}
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl"
        style={{ bottom: '10%', left: '20%' }}
        animate={{
          y: [0, -20, 0],
          x: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
