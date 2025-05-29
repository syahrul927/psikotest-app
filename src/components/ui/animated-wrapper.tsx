"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale"
    | "bounce"
    | "custom";
  duration?: number;
  delay?: number;
  className?: string;
}

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
  },
};

const AnimatedWrapper = React.forwardRef<HTMLDivElement, AnimatedWrapperProps>(
  (
    {
      children,
      animation = "slideUp",
      duration = 0.3,
      delay = 0,
      className,
      initial,
      animate,
      exit,
      transition,
      ...props
    },
    ref,
  ) => {
    // Use custom animation if provided, otherwise use preset
    const animationConfig =
      animation === "custom"
        ? { initial, animate, exit }
        : animationVariants[animation];

    const transitionConfig = transition || {
      duration,
      delay,
      ease: animation === "bounce" ? "easeOut" : "easeInOut",
    };

    return (
      <motion.div
        ref={ref}
        initial={animationConfig.initial}
        animate={animationConfig.animate}
        exit={animationConfig.exit}
        transition={transitionConfig}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

AnimatedWrapper.displayName = "AnimatedWrapper";

export { AnimatedWrapper };
