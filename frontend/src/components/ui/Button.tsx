import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  tone?: 'tradey-white' | 'tradey-red' | 'tradey-blue' | 'tradey-black';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  tone = 'tradey-red',
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 border-2 rounded-3xl font-garamond font-bold uppercase tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent";

  const toneClasses: Record<NonNullable<ButtonProps['tone']>, string> = {
    'tradey-white': 'border-tradey-white text-tradey-white hover:bg-tradey-white/10 focus:ring-tradey-white',
    'tradey-red': 'border-tradey-red text-tradey-red hover:bg-tradey-red/10 focus:ring-tradey-red',
    'tradey-blue': 'border-tradey-blue text-tradey-blue hover:bg-tradey-blue/10 focus:ring-tradey-blue',
    'tradey-black': 'border-tradey-black text-tradey-black hover:bg-tradey-black/10 focus:ring-tradey-black',
  };

  return (
    <button className={`${baseClasses} ${toneClasses[tone]} ${className}`} {...props}>
      {children}
    </button>
  );
};
