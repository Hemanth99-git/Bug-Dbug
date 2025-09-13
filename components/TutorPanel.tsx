import React, { useEffect, useRef } from 'react';
import type { TutorMessage } from '../types';
import { MessageSource } from '../types';
import { Spinner } from './Spinner';
import useStore from '../store';
import { Card } from './Card';
import { AiIcon, UserIcon } from '../constants';

interface MessageBubbleProps {
    message: TutorMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isAI = message.source === MessageSource.AI;

    if (message.source === MessageSource.SYSTEM) {
        return (
            <div className="w-full flex justify-center">
                <div className="max-w-lg p-2 text-center text-xs text-gray-400">
                    <p>{message.text}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
            {isAI && <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0"><AiIcon className="w-5 h-5 text-cyan-400" /></div>}
            <div className={`max-w-lg p-3 rounded-lg whitespace-pre-wrap ${isAI ? 'bg-gray-700' : 'bg-cyan-600'}`}>
                <p className="text-white">{message.text}</p>
            </div>
            {!isAI && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5 text-gray-300" /></div>}
        </div>
    );
};

export const TutorPanel: React.FC = () => {
    const messages = useStore(state => state.tutorMessages);
    const isLoading = useStore(state => state.isLoading);
    const error = useStore(state => state.error);
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <Card title="AI Tutor">
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
        </Card>
    );
};
