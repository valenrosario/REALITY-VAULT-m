import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CountdownTimerProps {
  targetDate: Date;
  onFinish: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsFinished(true);
        onFinish();
        return;
      }

      setTimeLeft({
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(timer);
  }, [targetDate, onFinish]);

  if (isFinished) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="flex justify-center gap-6 md:gap-10">
          <SimpleUnit value={timeLeft.hours} label="HR" />
          <SimpleUnit value={timeLeft.minutes} label="MIN" />
          <SimpleUnit value={timeLeft.seconds} label="SEG" />
        </div>

        <div className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent mx-auto"></div>
      </motion.div>
    </div>
  );
};

const SimpleUnit = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-5xl md:text-7xl font-light text-white tracking-tighter">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[10px] font-mono text-pink-300/50 mt-1 tracking-widest">{label}</span>
  </div>
);
