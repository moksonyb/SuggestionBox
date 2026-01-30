export interface Suggestion {
  id: string;
  text: string;
  votes: number;
  createdAt: Date;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  suggestions: Suggestion[];
  editToken: string;
  createdAt: Date;
  totalVotes: number;
}

export interface PollStore {
  polls: Record<string, Poll>;
  addPoll: (poll: Poll) => void;
  getPoll: (id: string) => Poll | undefined;
  updatePoll: (id: string, updates: Partial<Poll>) => void;
  addSuggestion: (pollId: string, suggestion: Suggestion) => void;
  voteSuggestion: (pollId: string, suggestionId: string) => void;
  deleteSuggestion: (pollId: string, suggestionId: string) => void;
  updateSuggestion: (pollId: string, suggestionId: string, text: string) => void;
}
