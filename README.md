# SuggestionBox

A modern, interactive polling and suggestion application built with React and TypeScript.

## Features

- 📊 Create and manage polls
- 💡 Submit and vote on suggestions
- 🎨 Beautiful, responsive UI with glassmorphism design
- ⚡ Fast and lightweight

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Testing:** Vitest

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd SuggestionBox

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Start the development servers (both frontend and backend)
npm run dev:all
```

The frontend will be available at `http://localhost:8080` and the API at `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start frontend development server only
- `npm run dev:server` - Start backend API server only
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code

## Deployment

### Docker

Build and run with Docker:

```bash
docker build -t suggestionbox .
docker run -p 3000:80 suggestionbox
```

Or use docker-compose:

```bash
docker-compose up -d
```

### Cloud Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Fly.io
- Render
- Google Cloud Run
- AWS ECS
- Azure Container Instances
- DigitalOcean
- Railway

## Project Structure

```
src/
├── components/     # React components
├── pages/          # Page components
├── stores/         # Zustand stores
├── types/          # TypeScript types
├── lib/            # Utility functions
└── hooks/          # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
