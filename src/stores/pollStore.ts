import { create } from 'zustand';
import type { Poll, Suggestion, PollStore } from '@/types/poll';
import { apiClient } from '@/lib/api';

export const usePollStore = create<PollStore>()((set, get) => ({
  polls: {},
  
  addPoll: (poll: Poll) => {
    set((state) => ({
      polls: { ...state.polls, [poll.id]: poll }
    }));
  },
  
  getPoll: (id: string) => {
    return get().polls[id];
  },
  
  updatePoll: (id: string, updates: Partial<Poll>) => {
    set((state) => ({
      polls: {
        ...state.polls,
        [id]: { ...state.polls[id], ...updates }
      }
    }));
  },
  
  addSuggestion: (pollId: string, suggestion: Suggestion) => {
    set((state) => {
      const poll = state.polls[pollId];
      if (!poll) return state;
      
      return {
        polls: {
          ...state.polls,
          [pollId]: {
            ...poll,
            suggestions: [...poll.suggestions, suggestion]
          }
        }
      };
    });
  },
  
  voteSuggestion: (pollId: string, suggestionId: string) => {
    set((state) => {
      const poll = state.polls[pollId];
      if (!poll) return state;
      
      return {
        polls: {
          ...state.polls,
          [pollId]: {
            ...poll,
            totalVotes: poll.totalVotes + 1,
            suggestions: poll.suggestions.map((s) =>
              s.id === suggestionId ? { ...s, votes: s.votes + 1 } : s
            )
          }
        }
      };
    });
  },
  
  deleteSuggestion: (pollId: string, suggestionId: string) => {
    set((state) => {
      const poll = state.polls[pollId];
      if (!poll) return state;
      
      const suggestion = poll.suggestions.find(s => s.id === suggestionId);
      const votesToRemove = suggestion?.votes || 0;
      
      return {
        polls: {
          ...state.polls,
          [pollId]: {
            ...poll,
            totalVotes: poll.totalVotes - votesToRemove,
            suggestions: poll.suggestions.filter((s) => s.id !== suggestionId)
          }
        }
      };
    });
  },
  
  updateSuggestion: (pollId: string, suggestionId: string, text: string) => {
    set((state) => {
      const poll = state.polls[pollId];
      if (!poll) return state;
      
      return {
        polls: {
          ...state.polls,
          [pollId]: {
            ...poll,
            suggestions: poll.suggestions.map((s) =>
              s.id === suggestionId ? { ...s, text } : s
            )
          }
        }
      };
    });
  },
}));
