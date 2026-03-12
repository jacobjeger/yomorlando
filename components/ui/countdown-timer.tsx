"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
}

function getTimeRemaining(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeRemaining(new Date(targetDate))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(new Date(targetDate)));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <p className="text-sm text-muted-foreground">Orders are now closed</p>
    );
  }

  return (
    <div>
      {label && (
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
      )}
      <div className="flex gap-2 text-center">
        <TimeUnit value={timeLeft.days} unit="days" />
        <TimeUnit value={timeLeft.hours} unit="hrs" />
        <TimeUnit value={timeLeft.minutes} unit="min" />
        <TimeUnit value={timeLeft.seconds} unit="sec" />
      </div>
    </div>
  );
}

function TimeUnit({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center bg-primary/10 rounded-md px-2 py-1 min-w-[3rem]">
      <span className="text-lg font-bold text-primary">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase">
        {unit}
      </span>
    </div>
  );
}
