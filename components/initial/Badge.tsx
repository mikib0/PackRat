import React from 'react';
import { Text, View } from 'react-native';
import { cn } from '~/lib/cn';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'worn' | 'consumable';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  textClassName?: string;
  prefix?: string;
}

export function Badge({
  children,
  variant = 'default',
  className,
  textClassName,
  prefix,
}: BadgeProps) {
  return (
    <View
      className={cn(
        'rounded-full px-2 py-1',
        variant === 'default' && 'bg-muted',
        variant === 'primary' && 'bg-primary',
        variant === 'secondary' && 'bg-secondary',
        variant === 'outline' && 'border border-border bg-transparent',
        variant === 'worn' && 'bg-emerald-100',
        variant === 'consumable' && 'bg-amber-100',
        className
      )}>
      <Text
        className={cn(
          'text-xs',
          variant === 'default' && 'text-muted-foreground',
          variant === 'primary' && 'text-primary-foreground',
          variant === 'secondary' && 'text-secondary-foreground',
          variant === 'outline' && 'text-foreground',
          variant === 'worn' && 'text-emerald-600',
          variant === 'consumable' && 'text-amber-600',
          textClassName
        )}>
        {prefix ? `${prefix}${children}` : children}
      </Text>
    </View>
  );
}
