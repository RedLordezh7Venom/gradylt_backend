// This script is used to run database migrations during deployment
const { execSync } = require('child_process');

// Run database migrations
async function main() {
  try {
    console.log('Running database migrations...');
    
    // Run Prisma migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Error running database migrations:', error);
    process.exit(1);
  }
}

main();
