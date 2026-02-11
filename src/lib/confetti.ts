import confetti from 'canvas-confetti';

export const triggerSuccessConfetti = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 9999, scalar: 1.2 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 70 * (timeLeft / duration);

    // Multiple bursts from different positions for a "papery explosion" feel
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
    });

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
    });

    // Occasional center bursts
    if (Math.random() > 0.7) {
      confetti({
        ...defaults,
        particleCount: particleCount * 2,
        origin: { x: 0.5, y: 0.5 },
        spread: 120,
        startVelocity: 60,
        colors: ['#ffffff', '#ff0000', '#00ff00', '#0000ff']
      });
    }
  }, 250);
};

export const triggerBasicConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 9999
  });
};
