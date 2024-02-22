"use client";

import { useState } from "react";
import { useTimer } from "react-timer-hook";
import { useWindowSize } from "usehooks-ts";
import { Badge } from "@/components/shadcn/ui/badge";
import Confetti from "react-confetti";

interface CountdownProps {
  title: string;
  date: Date;
  withConfetti?: boolean;
}

export function Countdown({ title, date, withConfetti }: CountdownProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width = 0, height = 0 } = useWindowSize();
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: date,
    onExpire: () => withConfetti && setShowConfetti(true),
  });

  return (
    <>
      {showConfetti && (
        <Confetti
          onConfettiComplete={() => setShowConfetti(false)}
          recycle={false}
          run={showConfetti}
          numberOfPieces={200}
          width={width}
          height={height}
        />
      )}
      <div className="border border-muted rounded-xl p-5 min-h-[150px]">
        <div className="flex justify-between">
          <div className="flex items-center flex-col">
            <h2 className="font-black text-3xl" suppressHydrationWarning>
              {days}
            </h2>
            <h3 className="font-bold">Days</h3>
          </div>
          <div className="flex items-center flex-col">
            <h2 className="font-black text-3xl" suppressHydrationWarning>
              {hours}
            </h2>
            <h3 className="font-bold">Hours</h3>
          </div>
          <div className="flex items-center flex-col">
            <h2 className="font-black text-3xl" suppressHydrationWarning>
              {minutes}
            </h2>
            <h3 className="font-bold">Minutes</h3>
          </div>
          <div className="flex items-center flex-col">
            <h2 className="font-black text-3xl" suppressHydrationWarning>
              {seconds}
            </h2>
            <h3 className="font-bold">Seconds</h3>
          </div>
        </div>
        <div className="pt-5">
          <Badge variant={"outline"} className="border-hackathon">
            Time Until {title}
          </Badge>
        </div>
      </div>
    </>
  );
}
