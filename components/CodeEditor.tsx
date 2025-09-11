
import React from 'react';
import { IconButton } from './IconButton';
import { GenerateIcon, HintIcon, SolutionIcon } from '../constants';

interface CodeEditorProps {
    topic: string;
    setTopic: (topic: string) => void;
    code: string;
    setCode: (code: string) => void;
    onGenerate: () => void;
    onRequestHint: () => void;
    onShowSolution: () => void;
    isLoading: boolean;
    isChallengeActive: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    topic,
    setTopic,
    code,
    setCode,
    onGenerate,
    onRequestHint,
    onShowSolution,
    isLoading,
    isChallengeActive
}) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl flex flex-col h-full border border-gray-700">
            <div className="p-4 border-b border-gray-700">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., 'JavaScript async/await' or 'Python list comprehension'"
                        className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        disabled={isLoading}
                    />
                    <IconButton
                        text="Generate Challenge"
                        icon={<GenerateIcon />}
                        onClick={onGenerate}
                        disabled={isLoading || !topic.trim()}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800/50"
                    />
                </div>
            </div>

            <div className="flex-grow p-4 relative">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-gray-900/50 rounded-md p-4 font-mono text-base text-gray-200 resize-none border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    placeholder="Your code challenge will appear here..."
                    spellCheck="false"
                    disabled={!isChallengeActive && !code}
                />
            </div>
            
            <div className="p-4 border-t border-gray-700 bg-gray-800/50 rounded-b-lg">
                <div className="flex justify-end gap-3">
                    <IconButton
                        text="Request Hint"
                        icon={<HintIcon />}
                        onClick={onRequestHint}
                        disabled={isLoading || !isChallengeActive}
                        className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-800/50"
                    />
                    <IconButton
                        text="Show Solution"
                        icon={<SolutionIcon />}
                        onClick={onShowSolution}
                        disabled={isLoading || !isChallengeActive}
                        className="bg-green-600 hover:bg-green-500 disabled:bg-green-800/50"
                    />
                </div>
            </div>
        </div>
    );
}
