/ jest.setup.js

// Extend jest matchers from React Testing Library
import '@testing-library/jest-dom/extend-expect';

// Optional: configure React Testing Library defaults
// e.g., configure({ testIdAttribute: 'data-test-id' });

// Mock Next.js <Image> component to render a normal <img>
import React from 'react';
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    };
  },
}));

// Example: enable fake timers if needed
// jest.useFakeTimers();

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
