import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useAnimation, Variants } from "framer-motion";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  threshold?: number;
  delay?: number;
}

export const AnimateOnScroll = ({
  children,
  className,
  variants,
  threshold = 0.1,
  delay = 0,
}: AnimateOnScrollProps) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
      },
    },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls, isVisible, threshold]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
