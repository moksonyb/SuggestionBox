import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import db from './db.js';
import type { CreatePollRequest, CreateSuggestionRequest, UpdateSuggestionRequest, PollWithSuggestions } from './types.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all polls (basic info only)
app.get('/api/polls', (req, res) => {
  try {
    const polls = db.prepare('SELECT id, title, description, created_at, total_votes FROM polls ORDER BY created_at DESC').all();
    res.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
});

// Create a new poll
app.post('/api/polls', (req, res) => {
  try {
    const { title, description } = req.body as CreatePollRequest;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const id = nanoid(10);
    const editToken = nanoid(32);
    const createdAt = Date.now();

    db.prepare(`
      INSERT INTO polls (id, title, description, edit_token, created_at, total_votes)
      VALUES (?, ?, ?, ?, ?, 0)
    `).run(id, title, description, editToken, createdAt);

    res.json({ id, title, description, editToken, createdAt, totalVotes: 0, suggestions: [] });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

// Get a specific poll with suggestions
app.get('/api/polls/:id', (req, res) => {
  try {
    const { id } = req.params;

    const poll = db.prepare('SELECT * FROM polls WHERE id = ?').get(id) as any;
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const suggestions = db.prepare('SELECT * FROM suggestions WHERE poll_id = ? ORDER BY votes DESC, created_at ASC').all(id);

    const response: PollWithSuggestions = {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      edit_token: poll.edit_token,
      created_at: poll.created_at,
      total_votes: poll.total_votes,
      suggestions: suggestions as any[]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

// Add a suggestion to a poll
app.post('/api/polls/:id/suggestions', (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body as CreateSuggestionRequest;

    if (!text) {
      return res.status(400).json({ error: 'Suggestion text is required' });
    }

    const poll = db.prepare('SELECT id FROM polls WHERE id = ?').get(id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const suggestionId = nanoid(10);
    const createdAt = Date.now();

    db.prepare(`
      INSERT INTO suggestions (id, poll_id, text, votes, created_at)
      VALUES (?, ?, ?, 0, ?)
    `).run(suggestionId, id, text, createdAt);

    res.json({ id: suggestionId, poll_id: id, text, votes: 0, created_at: createdAt });
  } catch (error) {
    console.error('Error creating suggestion:', error);
    res.status(500).json({ error: 'Failed to create suggestion' });
  }
});

// Vote on a suggestion
app.post('/api/polls/:pollId/suggestions/:suggestionId/vote', (req, res) => {
  try {
    const { pollId, suggestionId } = req.params;

    const suggestion = db.prepare('SELECT * FROM suggestions WHERE id = ? AND poll_id = ?').get(suggestionId, pollId);
    
    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    db.prepare('UPDATE suggestions SET votes = votes + 1 WHERE id = ?').run(suggestionId);
    db.prepare('UPDATE polls SET total_votes = total_votes + 1 WHERE id = ?').run(pollId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

// Update a suggestion (requires edit token)
app.put('/api/polls/:pollId/suggestions/:suggestionId', (req, res) => {
  try {
    const { pollId, suggestionId } = req.params;
    const { text } = req.body as UpdateSuggestionRequest;
    const editToken = req.headers['x-edit-token'] as string;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!editToken) {
      return res.status(401).json({ error: 'Edit token required' });
    }

    const poll = db.prepare('SELECT edit_token FROM polls WHERE id = ?').get(pollId) as any;
    
    if (!poll || poll.edit_token !== editToken) {
      return res.status(403).json({ error: 'Invalid edit token' });
    }

    const result = db.prepare('UPDATE suggestions SET text = ? WHERE id = ? AND poll_id = ?').run(text, suggestionId, pollId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating suggestion:', error);
    res.status(500).json({ error: 'Failed to update suggestion' });
  }
});

// Delete a suggestion (requires edit token)
app.delete('/api/polls/:pollId/suggestions/:suggestionId', (req, res) => {
  try {
    const { pollId, suggestionId } = req.params;
    const editToken = req.headers['x-edit-token'] as string;

    if (!editToken) {
      return res.status(401).json({ error: 'Edit token required' });
    }

    const poll = db.prepare('SELECT edit_token FROM polls WHERE id = ?').get(pollId) as any;
    
    if (!poll || poll.edit_token !== editToken) {
      return res.status(403).json({ error: 'Invalid edit token' });
    }

    const suggestion = db.prepare('SELECT votes FROM suggestions WHERE id = ? AND poll_id = ?').get(suggestionId, pollId) as any;
    
    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    db.prepare('DELETE FROM suggestions WHERE id = ?').run(suggestionId);
    db.prepare('UPDATE polls SET total_votes = total_votes - ? WHERE id = ?').run(suggestion.votes, pollId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    res.status(500).json({ error: 'Failed to delete suggestion' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
