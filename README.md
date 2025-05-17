# Gradlyft - Job & Student Portal

A comprehensive job and internship portal for students with engagement tools, soft skills modules, and university tie-ups.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and continuous deployment.

### Workflow

The CI/CD pipeline consists of the following stages:

1. **Lint**: Checks code quality using ESLint
2. **Test**: Runs Jest tests to ensure functionality
3. **Build**: Builds the Next.js application
4. **Deploy to Staging**: Automatically deploys to the staging environment when changes are pushed to the main branch
5. **Deploy to Production**: Manually triggered deployment to the production environment

### Setting Up CI/CD

To set up the CI/CD pipeline, you need to add the following secrets to your GitHub repository:

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

You can get these values from your Vercel account settings and project settings.

### Deployment Environments

- **Staging**: Automatically deployed when changes are pushed to the main branch
- **Production**: Manually triggered from the GitHub Actions workflow

### Manual Deployment

To manually deploy to production:

1. Go to the "Actions" tab in your GitHub repository
2. Select the "CI/CD Pipeline" workflow
3. Click "Run workflow"
4. Select "production" from the environment dropdown
5. Click "Run workflow"

## Development

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Building

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Database Migrations

Run database migrations:
```bash
npm run db:migrate
```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: URL for NextAuth.js

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
