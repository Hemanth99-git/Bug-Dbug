import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

const variantClasses = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800/50',
    secondary: 'bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800/50',
    success: 'bg-green-600 hover:bg-green-500 disabled:bg-green-800/50',
    warning: 'bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-800/50',
};

export const Button: React.FC<ButtonProps> = ({ children, icon, variant = 'primary', ...props }) => {
    return (
        <button
            {...props}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:cursor-not-allowed ${variantClasses[variant]} ${props.className}`}
        >
            {icon && <span className="w-5 h-5">{icon}</span>}
            <span>{children}</span>
        </button>
    );
};
