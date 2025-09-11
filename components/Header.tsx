
import React from 'react';
import { BugIcon } from '../constants';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-cyan-500/20 shadow-lg p-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
                <BugIcon className="w-8 h-8 text-cyan-400" />
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wider">Bug Catcher</h1>
                    <p className="text-sm text-cyan-400">Your Personal AI Debugging Tutor</p>
                </div>
            </div>
        </header>
    );
}
