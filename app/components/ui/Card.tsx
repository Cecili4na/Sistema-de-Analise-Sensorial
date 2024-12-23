// app/components/ui/Card.tsx
import React from 'react';

// Componente Card Root
const Card = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`
      bg-white rounded-xl shadow-md 
      border border-[#E6E6D8] 
      ${className || ''}
    `}
    {...props}
  />
));
Card.displayName = 'Card';

// Componente CardHeader
const CardHeader = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`
      p-6 border-b border-[#F0F0E5] 
      ${className || ''}
    `}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// Componente CardTitle
const CardTitle = React.forwardRef<
  HTMLHeadingElement, 
  React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={`
      text-xl font-semibold text-[#4A4A4A] 
      ${className || ''}
    `}
    {...props}
  >
    {children || 'Título do Card'}
  </h3>
));
CardTitle.displayName = 'CardTitle';

// Componente CardDescription
const CardDescription = React.forwardRef<
  HTMLParagraphElement, 
  React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={`
      text-sm text-[#6C7878] 
      ${className || ''}
    `}
    {...props}
  >
    {children || 'Descrição do card'}
  </p>
));
CardDescription.displayName = 'CardDescription';

// Componente CardContent
const CardContent = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`
      p-6 
      ${className || ''}
    `}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

// Componente CardFooter
const CardFooter = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`
      p-6 border-t border-[#F0F0E5] 
      flex items-center 
      ${className || ''}
    `}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
};