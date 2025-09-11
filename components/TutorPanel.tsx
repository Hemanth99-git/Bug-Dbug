
import React, { useEffect, useRef } from 'react';
import type { TutorMessage } from '../types';
import { MessageSource } from '../types';
import { Spinner } from './Spinner';

interface TutorPanelProps {
    messages: TutorMessage[];
    isLoading: boolean;
    error: string | null;
}

const MessageBubble: React.FC<{ message: TutorMessage }> = ({ message }) => {
    const isAI = message.source === MessageSource.AI;
    const bubbleClasses = isAI
        ? 'bg-cyan-800/50 self-start text-left rounded-r-lg rounded-bl-lg'
        : 'bg-gray-700 self-end text-right rounded-l-lg rounded-br-lg';

    return (
        <div className={`w-full flex ${isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-lg p-3 whitespace-pre-wrap ${bubbleClasses}`}>
                 <p className="text-gray-200">{message.text}</p>
            </div>
        </div>
    );
};

export const TutorPanel: React.FC<TutorPanelProps> = ({ messages, isLoading, error }) => {
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl flex flex-col h-full border border-gray-700">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">AI Tutor</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex justify-center items-center p-4">
                        <Spinner />
                    </div>
                )}
                 {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg">
                        <strong>Error:</strong> {error}
                    </div>
                )}
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
};
