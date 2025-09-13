import React, { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
    className?: string;
    title?: string;
    titleClassName?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, titleClassName = '' }) => {
    return (
        <div className={`bg-gray-800 rounded-lg shadow-2xl flex flex-col h-full border border-gray-700 ${className}`}>
            {title && (
                <div className={`p-4 border-b border-gray-700 ${titleClassName}`}>
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                </div>
            )}
            {children}
        </div>
    );
};
