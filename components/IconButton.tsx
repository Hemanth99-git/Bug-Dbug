
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    icon: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ text, icon, className, ...props }) => {
    return (
        <button
            {...props}
            className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {icon}
            <span>{text}</span>
        </button>
    );
};
