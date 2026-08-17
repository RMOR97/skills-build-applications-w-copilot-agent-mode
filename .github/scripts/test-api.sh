#!/bin/bash
# API Testing Script for OctoFit Tracker
# Tests /api/users and /api/activities endpoints

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}OctoFit Tracker API Endpoint Testing${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Determine API base URL
if [ -n "$CODESPACE_NAME" ]; then
    API_BASE_URL="https://$CODESPACE_NAME-8000.app.github.dev"
    echo -e "${BLUE}Environment: GitHub Codespaces${NC}"
else
    API_BASE_URL="http://localhost:8000"
    echo -e "${BLUE}Environment: Localhost${NC}"
fi

echo -e "${BLUE}API Base URL: $API_BASE_URL${NC}\n"

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo -e "${BLUE}Testing:${NC} $method $endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_BASE_URL$endpoint")
    else
        response=$(curl -s -X "$method" \
            -H "Content-Type: application/json" \
            "$API_BASE_URL$endpoint")
    fi
    
    # Check if response is valid JSON
    if echo "$response" | jq . > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Success${NC}"
        echo "$response" | jq .
    else
        echo -e "${RED}✗ Failed${NC}"
        echo "Response: $response"
    fi
    echo ""
}

# Test health endpoint
echo -e "${BLUE}1. Testing Health Check${NC}"
test_endpoint "GET" "/api/health"

# Test users endpoint
echo -e "${BLUE}2. Testing Users Endpoint${NC}"
test_endpoint "GET" "/api/users"

# Test activities endpoint
echo -e "${BLUE}3. Testing Activities Endpoint${NC}"
test_endpoint "GET" "/api/activities"

# Test teams endpoint
echo -e "${BLUE}4. Testing Teams Endpoint${NC}"
test_endpoint "GET" "/api/teams"

# Test leaderboard endpoint
echo -e "${BLUE}5. Testing Leaderboard Endpoint (allTime)${NC}"
test_endpoint "GET" "/api/leaderboard/allTime"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All endpoint tests completed!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

echo "API Configuration:"
echo "  - Backend Port: 8000"
echo "  - Frontend Port: 5173"
echo "  - MongoDB Port: 27017 (private)"
echo ""
echo "Quick Start:"
echo "  1. Backend:  cd octofit-tracker/backend && npm run dev"
echo "  2. Frontend: cd octofit-tracker/frontend && npm run dev"
echo "  3. Test API: bash .github/scripts/test-api.sh"
