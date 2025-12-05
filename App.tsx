
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { TutorPanel } from './components/TutorPanel';
import { TodoList } from './components/TodoList';
import { generateBuggyCode, getHint } from './services/geminiService';
import type { TutorMessage } from './types';
import { MessageSource } from './types';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [userCode, setUserCode] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([
    {
      source: MessageSource.AI,
      text: "Welcome to Bug Catcher! Enter a programming topic above, and I'll generate a code challenge for you. Let's find some bugs!",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState<number>(0);
  const [isChallengeActive, setIsChallengeActive] = useState<boolean>(false);

  const addMessage = (text: string, source: MessageSource) => {
    setTutorMessages(prev => [...prev, { text, source }]);
  };

  const handleGenerateCode = useCallback(async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setTutorMessages([]);
    addMessage(`Generating a challenge for: "${topic}"... this might take a moment.`, MessageSource.SYSTEM);

    try {
      const result = await generateBuggyCode(topic);
      if (result) {
        setUserCode(result.buggyCode);
        setSolution(result.correctCode);
        setExplanation(result.explanation);
        setHintCount(0);
        setIsChallengeActive(true);
        setTutorMessages([
            { source: MessageSource.AI, text: `Here's your challenge for "${topic}". I've introduced a bug for you to find. Good luck!` }
        ]);
      } else {
        throw new Error("Failed to generate code. The response was empty.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate code challenge: ${errorMessage}`);
      addMessage(`Oops! I couldn't generate a challenge for that topic. Please try a different one.`, MessageSource.AI);
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  const handleRequestHint = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    addMessage("Thinking of a hint for you...", MessageSource.SYSTEM);

    try {
      const hint = await getHint(userCode, topic, hintCount);
      addMessage(hint, MessageSource.AI);
      setHintCount(prev => prev + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get hint: ${errorMessage}`);
      addMessage(`Sorry, I had trouble coming up with a hint. Please try again.`, MessageSource.AI);
    } finally {
      setIsLoading(false);
    }
  }, [userCode, topic, hintCount]);

  const handleShowSolution = () => {
    setUserCode(solution);
    addMessage("Here's the solution:", MessageSource.SYSTEM);
    addMessage(explanation, MessageSource.AI);
    setIsChallengeActive(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col min-w-0">
          <CodeEditor
            topic={topic}
            setTopic={setTopic}
            code={userCode}
            setCode={setUserCode}
            onGenerate={handleGenerateCode}
            onRequestHint={handleRequestHint}
            onShowSolution={handleShowSolution}
            isLoading={isLoading}
            isChallengeActive={isChallengeActive}
          />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <TutorPanel messages={tutorMessages} isLoading={isLoading} error={error} />
        </div>
      </main>
      <div className="p-4 max-w-7xl mx-auto w-full">
        <TodoList />
      </div>
    </div>
  );
};

export default App;
