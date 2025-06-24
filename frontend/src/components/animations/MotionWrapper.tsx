import { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";

interface MotionWrapperProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

export const MotionWrapper = ({
  children,
  className,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },
  transition = { duration: 0.3 },
  ...rest
}: MotionWrapperProps) => {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const fadeIn = (
  direction: "up" | "down" | "left" | "right",
  delay: number = 0
) => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.8,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export const staggerContainer = (
  staggerChildren: number,
  delayChildren: number = 0
) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};
