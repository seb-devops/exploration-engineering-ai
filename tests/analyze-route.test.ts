import request from 'supertest';
import { describe, expect, it, vi, beforeEach, afterAll } from 'vitest';

const generateMock = vi.fn();
const getAgentMock = vi.fn(() => ({ generate: generateMock }));

vi.mock('@exploration/agent', () => ({
  mastra: {
    getAgent: getAgentMock,
  },
}));

async function createApp(envOverrides: Record<string, string> = {}) {
  vi.resetModules();
  generateMock.mockReset();
  getAgentMock.mockReset();
  generateMock.mockResolvedValue({ text: 'mock-response' });
  getAgentMock.mockReturnValue({ generate: generateMock });

  Object.assign(process.env, {
    NODE_ENV: 'test',
    ANALYZE_API_KEY: 'test-key',
    RATE_LIMIT_WINDOW_MS: '60000',
    RATE_LIMIT_MAX: '100',
    ...envOverrides,
  });

  const mod = await import('../src/app.js');
  return mod.default;
}

afterAll(() => {
  delete process.env.ANALYZE_API_KEY;
  delete process.env.RATE_LIMIT_WINDOW_MS;
  delete process.env.RATE_LIMIT_MAX;
});

describe('POST /analyze', () => {
  beforeEach(() => {
    generateMock.mockResolvedValue({ text: 'mock-response' });
  });

  it('returns agent response for valid payload', async () => {
    const app = await createApp();
    const response = await request(app)
      .post('/analyze')
      .set('x-api-key', 'test-key')
      .send({
        input: 'Summarize my spending',
        transactions: [{ amount: 42.5, vendor: 'Store', category: 'Shopping' }],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ text: 'mock-response' });
    expect(getAgentMock).toHaveBeenCalledWith('financialAgent');
    expect(generateMock).toHaveBeenCalledTimes(1);
  });

  it('rejects requests without API key when enforced', async () => {
    const app = await createApp();
    const response = await request(app)
      .post('/analyze')
      .send({ input: 'Hello' });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('API_KEY_INVALID');
  });

  it('rejects invalid payloads', async () => {
    const app = await createApp();
    const response = await request(app)
      .post('/analyze')
      .set('x-api-key', 'test-key')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error.details).toBeDefined();
    expect(generateMock).not.toHaveBeenCalled();
  });

  it('applies rate limiting based on configuration', async () => {
    const app = await createApp({ RATE_LIMIT_MAX: '1' });

    const ok = await request(app)
      .post('/analyze')
      .set('x-api-key', 'test-key')
      .send({ input: 'First request' });
    expect(ok.status).toBe(200);

    const limited = await request(app)
      .post('/analyze')
      .set('x-api-key', 'test-key')
      .send({ input: 'Second request' });
    expect(limited.status).toBe(429);
  });
});

