export const animationDefaults = {
  spring: {
    damping: 10,
    mass: 1,
    overshootClamping: false,
    restSpeedThreshold: 2,
    restDisplacementThreshold: 0.1,
  },
  timing: {
    duration: 300,
  },
  entrance: {
    duration: 500,
    delay: 0,
  },
  exit: {
    duration: 300,
  },
};

export const cardAnimation = {
  from: { opacity: 0, translateY: 20 },
  animate: { opacity: 1, translateY: 0 },
  transition: {
    type: 'timing' as const,
    duration: animationDefaults.entrance.duration,
  },
};

export const progressAnimation = {
  from: { width: '0%' },
  transition: {
    type: 'spring' as const,
    damping: 12,
    mass: 1,
    overshootClamping: false,
    restSpeedThreshold: 2,
    restDisplacementThreshold: 0.1,
    duration: 800,
  },
};

export const pressAnimation = {
  scale: 0.96,
  springConfig: {
    damping: 10,
    mass: 1,
    overshootClamping: false,
    restSpeedThreshold: 2,
    restDisplacementThreshold: 0.1,
  },
};

export const scaleOnPressAnimation = {
  scale: 0.98,
  springConfig: {
    damping: 10,
    mass: 1,
    overshootClamping: false,
    restSpeedThreshold: 2,
    restDisplacementThreshold: 0.1,
  },
};

export const spinAnimation = {
  from: { rotate: '0deg' },
  animate: { rotate: '360deg' },
  transition: {
    type: 'timing' as const,
    duration: 1000,
    loop: true,
  },
};

export const fadeInAnimation = {
  from: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    type: 'timing' as const,
    duration: 300,
  },
};

export const shimmerAnimation = {
  from: { opacity: 0.6 },
  animate: { opacity: 1 },
  transition: {
    type: 'timing' as const,
    duration: 800,
    loop: true,
  },
};
