// Jest setup file for ORCA MCP Server tests

// Global test configuration
beforeAll(() => {
  // Setup any global test configuration here
});

afterAll(() => {
  // Cleanup any global test resources here
});

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Suppress console.error and console.warn in tests unless explicitly needed
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Add custom matchers if needed
expect.extend({
  // Custom matchers can be added here
});