/**
 * Environment configuration for the OctoFit Tracker API
 * Supports GitHub Codespaces and localhost
 */

interface EnvironmentConfig {
  port: number;
  mongodbUri: string;
  apiBaseUrl: string;
  environment: 'codespace' | 'localhost' | 'production';
  corsOrigins: string[];
}

function getEnvironmentConfig(): EnvironmentConfig {
  const port = parseInt(process.env.PORT || '8000', 10);
  const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
  const codespaceName = process.env.CODESPACE_NAME;

  let apiBaseUrl: string;
  let environment: 'codespace' | 'localhost' | 'production';
  let corsOrigins: string[] = [];

  if (codespaceName) {
    // GitHub Codespaces environment
    apiBaseUrl = `https://${codespaceName}-8000.app.github.dev`;
    environment = 'codespace';
    // Allow requests from Codespaces frontend
    corsOrigins = [
      `https://${codespaceName}-5173.app.github.dev`,
      `http://localhost:5173`,
      apiBaseUrl,
    ];
  } else {
    // Localhost development
    apiBaseUrl = `http://localhost:${port}`;
    environment = 'localhost';
    corsOrigins = [
      `http://localhost:5173`,
      `http://localhost:${port}`,
      'http://127.0.0.1:5173',
      'http://127.0.0.1:' + port,
    ];
  }

  // Add production origin if specified
  if (process.env.ALLOWED_ORIGINS) {
    corsOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
  }

  return {
    port,
    mongodbUri,
    apiBaseUrl,
    environment,
    corsOrigins,
  };
}

const config = getEnvironmentConfig();

export default config;
export type { EnvironmentConfig };
