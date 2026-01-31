/**
 * Client integration tests for requestWithRetry.
 * Tests retries on network/5xx, no retry on 4xx, options.
 */

import { requestWithRetry } from '../../src/services/requestWithRetry';

describe('requestWithRetry', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns result on first success', async () => {
    const requestFn = jest.fn().mockResolvedValue({ data: 'ok' });
    const p = requestWithRetry(requestFn);
    const result = await p;
    expect(result).toEqual({ data: 'ok' });
    expect(requestFn).toHaveBeenCalledTimes(1);
  });

  it('throws immediately on 4xx (no retry)', async () => {
    const err = Object.assign(new Error('Unauthorized'), { response: { status: 401 } });
    const requestFn = jest.fn().mockRejectedValue(err);
    await expect(requestWithRetry(requestFn)).rejects.toThrow('Unauthorized');
    expect(requestFn).toHaveBeenCalledTimes(1);
  });

  it('retries on network error (no response)', async () => {
    const requestFn = jest.fn()
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ data: 'ok' });
    const p = requestWithRetry(requestFn, { maxRetries: 2, baseDelayMs: 100 });
    await jest.advanceTimersByTimeAsync(150);
    const result = await p;
    expect(result).toEqual({ data: 'ok' });
    expect(requestFn).toHaveBeenCalledTimes(2);
  });

  it('retries on 5xx', async () => {
    const err = Object.assign(new Error('Server Error'), { response: { status: 500 } });
    const requestFn = jest.fn()
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce({ data: 'ok' });
    const p = requestWithRetry(requestFn, { maxRetries: 2, baseDelayMs: 100 });
    await jest.advanceTimersByTimeAsync(150);
    const result = await p;
    expect(result).toEqual({ data: 'ok' });
    expect(requestFn).toHaveBeenCalledTimes(2);
  });

  it('throws after maxRetries exhausted', async () => {
    jest.useRealTimers();
    const requestFn = jest.fn().mockRejectedValue(new Error('Network Error'));
    await expect(
      requestWithRetry(requestFn, { maxRetries: 2, baseDelayMs: 1 })
    ).rejects.toThrow('Network Error');
    expect(requestFn).toHaveBeenCalledTimes(3);
    jest.useFakeTimers();
  }, 10000);

  it('uses default options when not provided', async () => {
    jest.useRealTimers();
    const requestFn = jest.fn().mockRejectedValue(new Error('Network Error'));
    await expect(requestWithRetry(requestFn)).rejects.toThrow('Network Error');
    expect(requestFn).toHaveBeenCalledTimes(3);
    jest.useFakeTimers();
  }, 15000);
});
