// Import jest-dom for DOM element assertions
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}));

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn().mockImplementation((name) => {
      if (name === 'adminId') return { value: 'mock-admin-id' };
      if (name === 'userId') return { value: 'mock-user-id' };
      if (name === 'employerId') return { value: 'mock-employer-id' };
      return null;
    }),
    set: jest.fn(),
    delete: jest.fn(),
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
