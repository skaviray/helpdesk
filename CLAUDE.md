# Ticketing App

## Project Structure

Monorepo using Bun workspaces with two packages:

- **frontend/** — React 19 + Vite 6 + TypeScript (port 5179)
- **backend/** — Express 5 + TypeScript, runs with Bun (port 3001)

## Commands

- `bun run dev` — start both frontend and backend
- `bun run dev:frontend` — start frontend only
- `bun run dev:backend` — start backend only

## Documentation

Always use the context7 MCP server to fetch up-to-date documentation for the libraries used in this project before providing answers. Key libraries:

- **React 19** — frontend UI
- **Vite 6** — frontend build tool
- **Express 5** — backend web framework
- **Bun** — runtime and package manager
- **TypeScript 5** — type system

When answering questions about any of these libraries, query context7 first — training data may be outdated, especially for React 19, Express 5, and Vite 6.
