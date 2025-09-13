import React from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { TutorPanel } from './components/TutorPanel';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="w-full md:w-7/12 flex flex-col min-w-0">
          <CodeEditor />
        </div>
        <div className="w-full md:w-5/12 flex flex-col min-w-0">
          <TutorPanel />
        </div>
      </main>
    </div>
  );
};

export default App;
