Authors: Thando Tsela

# Stock Price Lookup App

A modern web application built with React and TypeScript that allows users to look up stock prices. The application features user authentication and real-time stock data fetching.

## Features

- **User Authentication**
  - Secure signup and login using Supabase
  - Email verification
  - Protected routes for authenticated users
  - Automatic session management

- **Stock Price Lookup**
  - Real-time stock price data using Alpha Vantage API
  - Visual indicators for price changes
  - Clean and intuitive user interface
  - Loading states and error handling

- **Modern Tech Stack**
  - React 18 with TypeScript
  - Vite for blazing fast development
  - Tailwind CSS for styling
  - React Query for data fetching
  - React Router v6 for navigation

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account
- An Alpha Vantage API key

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Project Structure

```
project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── lib/           # Utility functions and API clients
│   ├── pages/         # Page components
│   └── __tests__/     # Test files
├── public/            # Static assets
└── ...config files
```

## Testing

The project includes integration tests using Vitest and React Testing Library. To run the tests:

```bash
npm run test
```

Key test cases cover:
- User signup flow
- Login functionality
- Stock price lookup
- Protected route behavior

## Deployment

The application can be deployed to various platforms:

### Netlify (Recommended)
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build the project: `npm run build`
3. Set up environment variables in Netlify:
   - Go to Netlify dashboard → Site settings → Build & deploy → Environment variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
     ```
4. Deploy: `netlify deploy`

> **Important**: The app requires these environment variables to function. They are not included in version control for security reasons.

### GitHub Pages Deployment
1. Ensure your environment variables are set in GitHub repository secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add your environment variables as secrets:
     ```
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
     VITE_ALPHA_VANTAGE_API_KEY
     ```
2. Deploy using one of these methods:
   - Push to main branch (automatic deployment via GitHub Actions)
   - Run manually: `npm run deploy`
3. Configure GitHub Pages:
   - Go to Settings → Pages
   - Set branch to `gh-pages` and folder to `/ (root)`

The site will be available at: https://ThandoTsela.github.io/StockLookup

## Docker Deployment

The application can be run using Docker. This is the recommended way to run the application as it ensures consistency across different environments.

### Using Docker Compose (Recommended)

1. Create a `.env` file with your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   ```

2. Run the application:
   ```bash
   docker-compose up --build
   ```

3. Access the application at `http://localhost:8080`

### Using Docker Directly

1. Build the image:
   ```bash
   docker build -t stock-lookup-app .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:80 \
     -e VITE_SUPABASE_URL=your_supabase_url \
     -e VITE_SUPABASE_ANON_KEY=your_supabase_anon_key \
     -e VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key \
     stock-lookup-app
   ```

3. Access the application at `http://localhost:8080`

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_SUPABASE_URL | Your Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Your Supabase anonymous key |
| VITE_ALPHA_VANTAGE_API_KEY | Your Alpha Vantage API key |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Supabase](https://supabase.com/) for authentication
- [Alpha Vantage](https://www.alphavantage.co/) for stock data
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Query](https://tanstack.com/query/latest) for data fetching
