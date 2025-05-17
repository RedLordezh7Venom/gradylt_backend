1. GitHub Actions Workflow
Created a CI/CD pipeline with the following stages:
Lint: Checks code quality using ESLint
Test: Runs Jest tests to ensure functionality
Build: Builds the Next.js application
Deploy to Staging: Automatically deploys to staging when changes are pushed to the main branch
Deploy to Production: Manually triggered deployment to production
2. Testing Framework
Set up Jest for testing with:
Configuration for Next.js
Test environment setup
Mock implementations for Next.js features
Sample test for the AdminLoginForm component
3. Vercel Deployment
Created a Vercel configuration file (vercel.json) with:
Build and development commands
Environment variable placeholders
Region configuration
4. Database Migration
Added a script for running database migrations during deployment
Updated package.json with database migration commands
5. Documentation
Updated the README.md with:
CI/CD pipeline information
Setup instructions
Deployment procedures
Environment variable requirements
6. Environment Configuration
Created a .env.example file with required environment variables
Updated .gitignore to exclude sensitive files but include the example file
How to Use the CI/CD Pipeline
Push to Main Branch:
When you push changes to the main branch, the CI/CD pipeline will automatically:
Run linting checks
Run tests
Build the application
Deploy to the staging environment
Manual Production Deployment:
To deploy to production:
Go to the "Actions" tab in your GitHub repository
Select the "CI/CD Pipeline" workflow
Click "Run workflow"
Select "production" from the environment dropdown
Click "Run workflow"
Setting Up Secrets:
Add the following secrets to your GitHub repository:
VERCEL_TOKEN: Your Vercel API token
VERCEL_ORG_ID: Your Vercel organization ID
VERCEL_PROJECT_ID: Your Vercel project ID