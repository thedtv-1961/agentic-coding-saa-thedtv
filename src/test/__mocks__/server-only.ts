// Mock for server-only package in Vitest (jsdom) test environment.
// The real package throws when imported outside a React Server Component context.
// This no-op mock allows server action files to be tested in isolation.
export {};
