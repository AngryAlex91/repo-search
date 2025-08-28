# GitHub Repository Search

A React TypeScript application that allows users to search GitHub repositories using the GitHub REST API.

## Features

- Real-time repository search with debounced input
- Filter by programming language
- Sort by relevance, stars, forks, or last updated
- Pagination with up to 1,000 results
- Responsive design for mobile and desktop
- Optional GitHub token for higher rate limits

## Tech Stack

- **React 18** with TypeScript
- **GitHub Search API**
- **CSS** for styling
- **Custom hooks** for state management

## Getting Started

1. Copy the code into your React project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm run dev
   ```

## Usage

- Type search terms in the input field
- Search happens automatically as you type (debounced)
- Use filters to narrow down results
- Click repository names to visit GitHub pages
- Add GitHub token in Advanced Settings for higher rate limits

## API Rate Limits

- **Without token**: 60 requests/hour
- **With token**: 5,000 requests/hour

## Project Structure

```
src/
├── components/
│   ├── Pagination.tsx      # Page navigation component
│   ├── RepoCard.tsx        # Individual repository display
│   ├── SearchForm.tsx      # Search input and filters
│   └── SearchResults.tsx   # Results container and states
├── hooks/
│   └── useDebounce.ts      # Debounced value hook
├── pages/
│   └── RepoPage.tsx        # Main search page
├── utilities/
│   └── formatting.ts       # Number and date formatting
└── types.ts                # TypeScript type definitions
```

## Key Implementation Details

- **Debounced search** prevents excessive API calls
- **Request cancellation** handles component unmounting
- **Dynamic filtering** for immediate UI feedback
- **Responsive grid** layout for repository cards