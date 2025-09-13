import React from 'react';
import { BugIcon } from '../constants';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/30 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg p-4 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BugIcon className="w-9 h-9 text-cyan-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wider">Bug Catcher</h1>
                        <p className="text-sm text-cyan-400/80">Your Personal AI Debugging Tutor</p>
                    </div>
                </div>
                {/* Placeholder for future user profile icon */}
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
            </div>
        </header>
    );
}
