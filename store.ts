import { create } from 'zustand';
import type { TutorMessage } from './types';
import { MessageSource } from './types';
import { generateBuggyCode, getHint } from './services/geminiService';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface State {
  topic: string;
  language: string;
  difficulty: Difficulty;
  userCode: string;
  solution: string;
  explanation: string;
  tutorMessages: TutorMessage[];
  isLoading: boolean;
  error: string | null;
  hintCount: number;
  isChallengeActive: boolean;
}

interface Actions {
  setTopic: (topic: string) => void;
  setLanguage: (language: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setUserCode: (code: string) => void;
  generateChallenge: () => Promise<void>;
  requestHint: () => Promise<void>;
  showSolution: () => void;
  submitSolution: () => void;
}

const useStore = create<State & Actions>((set, get) => ({
  topic: '',
  language: 'javascript',
  difficulty: 'Beginner',
  userCode: '',
  solution: '',
  explanation: '',
  tutorMessages: [
    {
      source: MessageSource.AI,
      text: "Welcome to Bug Catcher! Enter a programming topic above, and I'll generate a code challenge for you. Let's find some bugs!",
    },
  ],
  isLoading: false,
  error: null,
  hintCount: 0,
  isChallengeActive: false,

  setTopic: (topic) => set({ topic }),
  setLanguage: (language) => set({ language }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setUserCode: (code) => set({ userCode: code }),

  generateChallenge: async () => {
    const { topic, language, difficulty } = get();
    if (!topic.trim()) {
      set({ error: "Please enter a topic." });
      return;
    }

    set({ isLoading: true, error: null, tutorMessages: [], isChallengeActive: false });

    set(state => ({
      tutorMessages: [...state.tutorMessages, { text: `Generating a ${difficulty} challenge for: "${topic}" in ${language}... this might take a moment.`, source: MessageSource.SYSTEM }]
    }));

    try {
      // Pass language and difficulty to the service
      const result = await generateBuggyCode(topic, language, difficulty);
      if (result) {
        set({
          userCode: result.buggyCode,
          solution: result.correctCode,
          explanation: result.explanation,
          hintCount: 0,
          isChallengeActive: true,
          tutorMessages: [
            { source: MessageSource.AI, text: `Here's your challenge for "${topic}". I've introduced a bug for you to find. Good luck!` }
          ]
        });
      } else {
        throw new Error("Failed to generate code. The response was empty.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      set({ error: `Failed to generate code challenge: ${errorMessage}` });
      set(state => ({
        tutorMessages: [...state.tutorMessages, { text: `Oops! I couldn't generate a challenge for that topic. Please try a different one.`, source: MessageSource.AI }]
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  requestHint: async () => {
    set({ isLoading: true, error: null });
    set(state => ({
      tutorMessages: [...state.tutorMessages, { text: "Thinking of a hint for you...", source: MessageSource.SYSTEM }]
    }));

    try {
      const { userCode, topic, hintCount } = get();
      const hint = await getHint(userCode, topic, hintCount);
      set(state => ({
        tutorMessages: [...state.tutorMessages, { text: hint, source: MessageSource.AI }],
        hintCount: state.hintCount + 1
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      set({ error: `Failed to get hint: ${errorMessage}` });
      set(state => ({
        tutorMessages: [...state.tutorMessages, { text: `Sorry, I had trouble coming up with a hint. Please try again.`, source: MessageSource.AI }]
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  showSolution: () => {
    const { solution, explanation } = get();
    set(state => ({
      userCode: solution,
      isChallengeActive: false,
      tutorMessages: [
        ...state.tutorMessages,
        { text: "Here's the solution:", source: MessageSource.SYSTEM },
        { text: explanation, source: MessageSource.AI }
      ]
    }));
  },

  submitSolution: () => {
    const { userCode, solution } = get();
    // Normalize whitespace and remove semicolons for a more lenient comparison
    const normalize = (str: string) => str.replace(/\s/g, '').replace(/;/g, '');

    if (normalize(userCode) === normalize(solution)) {
      set(state => ({
        tutorMessages: [...state.tutorMessages, { text: "That's it! You've fixed the bug. Great job!", source: MessageSource.AI }],
        isChallengeActive: false,
      }));
    } else {
      set(state => ({
        tutorMessages: [...state.tutorMessages, { text: "Not quite. There's still a bug in there. Try asking for a hint if you're stuck!", source: MessageSource.AI }],
      }));
    }
  }
}));

export default useStore;
