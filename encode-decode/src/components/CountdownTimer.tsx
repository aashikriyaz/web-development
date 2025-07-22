import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  const [isActive, setIsActive] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const calculateTimeRemaining = useCallback((endDate: Date): TimeRemaining => {
    const now = new Date().getTime();
    const target = endDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: difference };
  }, []);

  const updateTimer = useCallback(() => {
    if (targetDate) {
      const endDate = new Date(targetDate);
      const remaining = calculateTimeRemaining(endDate);
      setTimeRemaining(remaining);

      if (remaining.total <= 0) {
        setIsActive(false);
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
        toast({
          title: "⏰ Time's Up!",
          description: "Your countdown has reached zero!",
          duration: 5000,
        });
      }
    }
  }, [targetDate, calculateTimeRemaining, intervalId, toast]);

  const startTimer = () => {
    if (!targetDate) {
      toast({
        title: "Please set a target date",
        description: "Choose a future date and time for the countdown",
        variant: "destructive",
      });
      return;
    }

    const endDate = new Date(targetDate);
    const now = new Date();
    
    if (endDate <= now) {
      toast({
        title: "Invalid date",
        description: "Please select a future date and time",
        variant: "destructive",
      });
      return;
    }

    setIsActive(true);
    const id = setInterval(updateTimer, 1000);
    setIntervalId(id);
  };

  const pauseTimer = () => {
    setIsActive(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
    setTargetDate('');
  };

  useEffect(() => {
    if (isActive) {
      updateTimer();
    }
  }, [isActive, updateTimer]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Get current datetime for min attribute (prevent past dates)
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 30); // Add 30 seconds to ensure it's in the future
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-pulse-glow">
            Countdown Timer
          </h1>
          <p className="text-xl text-muted-foreground">
            Set your target date and watch the time tick away
          </p>
        </div>

        {/* Date Input */}
        <Card className="p-6 bg-gradient-card border-border shadow-card">
          <div className="space-y-4">
            <Label htmlFor="target-date" className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Target Date & Time
            </Label>
            <Input
              id="target-date"
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={getCurrentDateTime()}
              className="text-lg h-12 bg-background/50 border-border focus:border-primary"
            />
          </div>
        </Card>

        {/* Countdown Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Days', value: timeRemaining.days },
            { label: 'Hours', value: timeRemaining.hours },
            { label: 'Minutes', value: timeRemaining.minutes },
            { label: 'Seconds', value: timeRemaining.seconds }
          ].map((item, index) => (
            <Card key={item.label} className="p-6 bg-gradient-card border-border shadow-card text-center">
              <div className="space-y-2">
                <div className={`text-5xl md:text-6xl font-bold text-primary ${
                  isActive && item.label === 'Seconds' ? 'animate-pulse-glow' : ''
                }`}>
                  {formatNumber(item.value)}
                </div>
                <div className="text-lg font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!isActive ? (
            <Button
              onClick={startTimer}
              variant="timer"
              size="xl"
              className="gap-3"
            >
              <Play className="w-6 h-6" />
              Start Timer
            </Button>
          ) : (
            <Button
              onClick={pauseTimer}
              variant="timer"
              size="xl"
              className="gap-3"
            >
              <Pause className="w-6 h-6" />
              Pause Timer
            </Button>
          )}
          
          <Button
            onClick={resetTimer}
            variant="reset"
            size="xl"
            className="gap-3"
          >
            <RotateCcw className="w-6 h-6" />
            Reset Timer
          </Button>
        </div>

        {/* Status */}
        {targetDate && (
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              {isActive ? (
                <span className="text-primary font-semibold">⏱️ Timer is running</span>
              ) : timeRemaining.total > 0 ? (
                <span className="text-accent font-semibold">⏸️ Timer is paused</span>
              ) : (
                <span className="text-muted-foreground">⏰ Set a target date to begin</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;