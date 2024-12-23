// app/components/ui/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';


const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-[#8BA989] text-white hover:bg-[#6E8F6E]',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-[#C4A484] text-[#A0522D] hover:bg-[#F0E6D2]',
        secondary: 'bg-[#F0F0E5] text-[#4A4A4A] hover:bg-[#E6E6D8]',
        ghost: 'hover:bg-[#F7F3E8] hover:text-[#4A4A4A]',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Interface para as props do botão
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Componente de Botão
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;