import { vi } from 'vitest';

vi.mock('./database.js', () => ({
  default: {
    authenticate: vi.fn().mockResolvedValue(undefined),
    sync: vi.fn().mockResolvedValue(undefined),
    define: vi.fn(),
    query: vi.fn(),
  },
}));