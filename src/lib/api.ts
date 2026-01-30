const API_URL = '';

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
  suggestions: Suggestion[];
}

class ApiClient {
  private getEditToken(pollId: string): string | null {
    return localStorage.getItem(`poll_edit_token_${pollId}`);
  }

  private saveEditToken(pollId: string, token: string) {
    localStorage.setItem(`poll_edit_token_${pollId}`, token);
  }

  async createPoll(title: string, description: string): Promise<Poll> {
    const response = await fetch(`${API_URL}/api/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error('Failed to create poll');
    }

    const poll = await response.json();
    this.saveEditToken(poll.id, poll.edit_token);
    return poll;
  }

  async getPoll(id: string): Promise<Poll | null> {
    const response = await fetch(`${API_URL}/api/polls/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch poll');
    }

    return response.json();
  }

  async addSuggestion(pollId: string, text: string): Promise<Suggestion> {
    const response = await fetch(`${API_URL}/api/polls/${pollId}/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to add suggestion');
    }

    return response.json();
  }

  async voteSuggestion(pollId: string, suggestionId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/polls/${pollId}/suggestions/${suggestionId}/vote`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to vote');
    }
  }

  async updateSuggestion(pollId: string, suggestionId: string, text: string): Promise<void> {
    const editToken = this.getEditToken(pollId);
    
    if (!editToken) {
      throw new Error('No edit permission');
    }

    const response = await fetch(`${API_URL}/api/polls/${pollId}/suggestions/${suggestionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Edit-Token': editToken,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to update suggestion');
    }
  }

  async deleteSuggestion(pollId: string, suggestionId: string): Promise<void> {
    const editToken = this.getEditToken(pollId);
    
    if (!editToken) {
      throw new Error('No edit permission');
    }

    const response = await fetch(`${API_URL}/api/polls/${pollId}/suggestions/${suggestionId}`, {
      method: 'DELETE',
      headers: {
        'X-Edit-Token': editToken,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete suggestion');
    }
  }

  hasEditPermission(pollId: string): boolean {
    return !!this.getEditToken(pollId);
  }
}

export const apiClient = new ApiClient();
