/**
 * Reusable button/link component.
 *
 * Renders a styled button or Next.js link with variant and size options.
 */

import Link from 'next/link';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline'; // Example variants
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  href,
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = "font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantStyles = {
    primary: "button-primary dark:bg-secondary dark:text-lightblue dark:hover:text-lightblue",
    secondary: "bg-secondary text-white hover:bg-primary focus:ring-secondary dark:bg-primary dark:text-lightblue dark:hover:bg-secondary dark:focus:ring-primary",
    outline: "button-outline dark:border-secondary dark:text-lightblue dark:hover:text-lightblue",
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className || ''}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName} {...(props as any)}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
