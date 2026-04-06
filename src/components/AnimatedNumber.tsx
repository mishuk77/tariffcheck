import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  style?: StyleProp<TextStyle>;
  formatFn?: (n: number) => string;
}

export default function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  duration = 600,
  style,
  formatFn,
}: Props) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number>(0);
  const startValue = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue.current + (value - startValue.current) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  const formatted = formatFn
    ? formatFn(displayValue)
    : displayValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return (
    <Text style={style}>
      {prefix}{formatted}{suffix}
    </Text>
  );
}
