import { create } from 'zustand';
import { chatBot } from '../util/chatBot';

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
  isComplete?: boolean;
}

interface AppState {
  isExpanded: boolean;
  messages: Message[];
  inputMessage: string;
  setIsExpanded: (isExpanded: boolean) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  addMessageStream: (fullMessage: string) => void;
  updateLastMessage: (content: string) => void;
  setMessageComplete: () => void;
  setInputMessage: (message: string) => void;
  sendMessage: (message: string, pseudoMessage?: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  isExpanded: false,
  messages: [],
  inputMessage: '',
  
  setIsExpanded: (isExpanded: boolean) => set({ isExpanded }),
  
  setMessages: (messages: Message[]) => set({ messages }),
  
  addMessage: (message: Message) => 
    set((state) => ({ messages: [...state.messages, message] })),

  addMessageStream: (fullMessage: string) => {
    const { addMessage, updateLastMessage, setMessageComplete } = useAppStore.getState();
    
    // Add initial empty message
    addMessage({
      content: '',
      isUser: false,
      timestamp: new Date(),
      isComplete: false
    });

    // Split message into words
    const words = fullMessage.split(' ');
    let currentWordIndex = 0;

    // Stream words with setInterval
    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        // Add next word with space
        updateLastMessage(words[currentWordIndex] + ' ');
        currentWordIndex++;
      } else {
        // End streaming
        clearInterval(interval);
        setMessageComplete();
      }
    }, 40); // Update every 100ms
  },
  
  updateLastMessage: (content: string) =>
    set((state) => {
      const newMessages = [...state.messages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage) {
        lastMessage.content += content;
      }
      return { messages: newMessages };
    }),
    
  setMessageComplete: () =>
    set((state) => {
      const newMessages = [...state.messages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage) {
        lastMessage.isComplete = true;
      }
      return { messages: newMessages };
    }),
  
  setInputMessage: (message: string) => set({ inputMessage: message }),

  sendMessage: async (message: string, pseudoMessage?: string) => {
    const { addMessage, updateLastMessage, setMessageComplete } = useAppStore.getState();
    
    if (message.trim()) {
      // Add user message
      addMessage({
        content: pseudoMessage || message,
        isUser: true,
        timestamp: new Date(),
      });
      
      // Add initial AI message
      addMessage({
        content: '',
        isUser: false,
        timestamp: new Date(),
        isComplete: false
      });

      try {
        for await (const chunk of chatBot(message)) {
          updateLastMessage(chunk);
        }
        setMessageComplete();
      } catch (error) {
        console.error('Error processing AI response:', error);
      }
    }
  }
})); 