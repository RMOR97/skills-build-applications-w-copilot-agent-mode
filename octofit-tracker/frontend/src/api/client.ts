/**
 * API Client for OctoFit Tracker
 * Automatically detects and uses the correct API base URL
 * Supports GitHub Codespaces and localhost
 */

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

function getApiBaseUrl(): string {
  // Check if running in GitHub Codespaces
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  
  if (codespaceName) {
    // Use Codespaces URL
    return `https://${codespaceName}-8000.app.github.dev`;
  }
  
  // Use localhost (development)
  const port = import.meta.env.VITE_API_PORT || '8000';
  return `http://localhost:${port}`;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
    console.log(`🔗 API Client initialized with base URL: ${this.baseUrl}`);
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      };
    }
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export URL getter for debugging/display
export { getApiBaseUrl };
