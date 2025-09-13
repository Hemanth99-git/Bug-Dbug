import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css';

import { GenerateIcon, HintIcon, SolutionIcon, SubmitIcon } from '../constants';
import useStore from '../store';
import { Card } from './Card';
import { Button } from './Button';

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
];

const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

export const CodeEditor: React.FC = () => {
    const {
        topic, setTopic,
        code, setUserCode,
        language, setLanguage,
        difficulty, setDifficulty,
        generateChallenge,
        requestHint,
        showSolution,
        submitSolution,
        isLoading,
        isChallengeActive
    } = useStore();

    return (
        <Card>
            <div className="p-4 border-b border-gray-700 space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., 'async/await' or 'list comprehension'"
                        className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        disabled={isLoading}
                    />
                    <Button
                        icon={<GenerateIcon />}
                        onClick={generateChallenge}
                        disabled={isLoading || !topic.trim()}
                        variant="primary"
                    >
                        Generate Challenge
                    </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        disabled={isLoading}
                    >
                        {languageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        disabled={isLoading}
                    >
                        {difficultyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex-grow p-4 relative bg-gray-900/50">
                <Editor
                    value={code}
                    onValueChange={c => setUserCode(c)}
                    highlight={c => highlight(c, languages[language] || languages.js, language)}
                    padding={16}
                    className="w-full h-full font-mono text-base text-gray-200 resize-none border border-transparent focus-within:outline-none focus-within:ring-2 focus-within:ring-cyan-500 transition rounded-md"
                    placeholder="Your code challenge will appear here..."
                    disabled={!isChallengeActive && !code}
                />
            </div>
            
            <div className="p-4 border-t border-gray-700 bg-gray-800/50 rounded-b-lg">
                <div className="flex justify-end gap-3">
                    <Button
                        icon={<HintIcon />}
                        onClick={requestHint}
                        disabled={isLoading || !isChallengeActive}
                        variant="warning"
                    >
                        Request Hint
                    </Button>
                    <Button
                        icon={<SubmitIcon />}
                        onClick={submitSolution}
                        disabled={isLoading || !isChallengeActive}
                        variant="primary"
                    >
                        Submit
                    </Button>
                    <Button
                        icon={<SolutionIcon />}
                        onClick={showSolution}
                        disabled={isLoading || !isChallengeActive}
                        variant="success"
                    >
                        Show Solution
                    </Button>
                </div>
            </div>
        </Card>
    );
}
