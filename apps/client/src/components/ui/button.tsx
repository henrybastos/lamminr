import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cva, cx } from 'cva';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'icon:sm' | 'icon:md';
  children: React.ReactNode;
}

export default function Button({ variant, size, children, ...props }: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const style = cva({
    base: "flex flex-row items-center justify-center rounded-sm transition-all cursor-pointer",
    variants: {
      variant: {
        primary: "bg-neutral-950 text-neutral-50 border-solid border-neutral-950 hover:bg-neutral-800",
        secondary: "bg-transparent text-neutral-950 border border-solid border-neutral-300 hover:bg-neutral-100",
        ghost: "bg-transparent text-neutral-950 hover:bg-neutral-200",
      },
      size: {
        "sm": "h-7 px-2 text-sm",
        "md": "h-8 px-3 text-base",
        "icon:sm": "h-7 w-7",
        "icon:md": "h-8 w-8",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    },
  });

  return (
    <BaseButton {...props} className={cx(style({ variant, size }))}>
      { children }
    </BaseButton>
  );
}
