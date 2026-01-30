# SuggestionBox API Server

Backend API server for SuggestionBox using Express and SQLite.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

- `GET /health` - Health check
- `GET /api/polls` - List all polls
- `POST /api/polls` - Create a poll
- `GET /api/polls/:id` - Get poll with suggestions
- `POST /api/polls/:id/suggestions` - Add suggestion
- `POST /api/polls/:pollId/suggestions/:suggestionId/vote` - Vote
- `PUT /api/polls/:pollId/suggestions/:suggestionId` - Update suggestion (requires edit token)
- `DELETE /api/polls/:pollId/suggestions/:suggestionId` - Delete suggestion (requires edit token)

## Database

SQLite database stored in `../data/polls.db`
