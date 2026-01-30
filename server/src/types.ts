export interface Suggestion {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
  created_at: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  edit_token: string;
  created_at: number;
  total_votes: number;
}

export interface PollWithSuggestions extends Poll {
  suggestions: Suggestion[];
}

export interface CreatePollRequest {
  title: string;
  description: string;
}

export interface CreateSuggestionRequest {
  text: string;
}

export interface UpdateSuggestionRequest {
  text: string;
}
