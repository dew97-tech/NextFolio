import { Variants, Transition } from "framer-motion";

export const transitions = {
  expo: {
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1],
  } as Transition,

  spring: {
    type: "spring",
    damping: 12,
    stiffness: 100,
  } as Transition,

  springSnappy: {
    type: "spring",
    damping: 15,
    stiffness: 150,
  } as Transition,

  springGentle: {
    type: "spring",
    damping: 20,
    stiffness: 80,
  } as Transition,

  tween: {
    duration: 0.5,
    ease: "easeOut",
  } as Transition,

  tweenQuick: {
    duration: 0.3,
    ease: "easeOut",
  } as Transition,

  page: {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1],
  } as Transition,

  stagger: {
    staggerChildren: 0.1,
    delayChildren: 0.2,
  } as Transition,

  staggerFast: {
    staggerChildren: 0.05,
    delayChildren: 0.1,
  } as Transition,
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transitions.expo,
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transitions.expo,
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: transitions.expo,
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: transitions.expo,
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.tween,
  },
};

export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
};

export const scaleDown: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.2,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
};

export const slideInFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.expo,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.stagger,
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.staggerFast,
  },
};

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.page,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: transitions.tweenQuick,
  },
};

export const cardHover: Variants = {
  rest: {
    scale: 1,
    transition: transitions.tweenQuick,
  },
  hover: {
    scale: 1.02,
    transition: transitions.springSnappy,
  },
};

export const card3D: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    transition: transitions.springSnappy,
  },
  hover: {
    transition: transitions.springSnappy,
  },
};

export const letterAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: -90,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: transitions.spring,
  },
};

export const wordAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.springGentle,
  },
};

export function createStaggerDelay(index: number, baseDelay: number = 0.1): number {
  return index * baseDelay;
}

export function createSpringTransition(
  damping: number = 12,
  stiffness: number = 100
): Transition {
  return {
    type: "spring",
    damping,
    stiffness,
  };
}

export function createTweenTransition(
  duration: number = 0.5,
  ease: [number, number, number, number] = [0, 0, 0.2, 1]
): Transition {
  return {
    duration,
    ease,
  };
}
