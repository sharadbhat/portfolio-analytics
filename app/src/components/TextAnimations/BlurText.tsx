import { motion, useReducedMotion } from "motion/react";

type BlurTextProps = {
  text: string;
  className?: string;
};

function BlurText({ text, className }: BlurTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, filter: "blur(12px)", y: 18 }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, filter: "blur(0px)", y: 0 }
          }
          transition={{
            duration: 0.45,
            ease: "easeOut",
            delay: index * 0.06,
          }}
          style={{
            display: "inline-block",
            willChange: "transform, filter, opacity",
          }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

export default BlurText;
