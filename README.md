# SuggestionBox

A modern, interactive polling and suggestion application built with React and TypeScript.

## Features

- 📊 Create and manage polls
- 💡 Submit and vote on suggestions
- 🎨 Beautiful, responsive UI with glassmorphism design
- ⚡ Fast and lightweight

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
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

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
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
