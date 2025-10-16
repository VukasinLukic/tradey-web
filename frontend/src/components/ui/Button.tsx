import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "w-full py-3 px-4 font-garamond font-bold rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-tradey-black";
  
  const variantClasses = {
    primary: "bg-tradey-red text-tradey-white hover:opacity-90 focus:ring-tradey-red",
    secondary: "bg-tradey-blue text-tradey-black hover:opacity-90 focus:ring-tradey-blue",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
