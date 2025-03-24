import { createId } from '@paralleldrive/cuid2'
import { Redis } from 'ioredis'

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

/**
 * Acquires a distributed lock with a specified timeout
 * @param key The lock key to acquire
 * @param ttlMs Time-to-live in milliseconds
 * @param retryMs Time between retries in milliseconds
 * @param maxRetries Maximum number of retries
 * @returns Promise resolving to a lock identifier if successful, null otherwise
 */
export async function acquireLock(
  key: string,
  ttlMs = 30000,
  retryMs = 100,
  maxRetries = 10,
): Promise<string | null> {
  const lockId = createId()
  let retries = 0

  while (retries < maxRetries) {
    // Try to set the key with NX option (only if it doesn't exist)
    const result = await redis.set(`lock:${key}`, lockId, 'PX', ttlMs, 'NX')

    if (result === 'OK') {
      return lockId
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, retryMs))
    retries++
  }

  return null
}

/**
 * Releases a previously acquired lock
 * @param key The lock key to release
 * @param lockId The lock identifier returned when acquiring the lock
 * @returns Promise resolving to true if the lock was released, false otherwise
 */
export async function releaseLock(
  key: string,
  lockId: string,
): Promise<boolean> {
  // Use Lua script to ensure we only delete the lock if it's still ours
  const script = `
    if redis.call('get', KEYS[1]) == ARGV[1] then
      return redis.call('del', KEYS[1])
    else
      return 0
    end
  `

  const result = await redis.eval(script, 1, `lock:${key}`, lockId)

  return result === 1
}

/**
 * Executes a function with a lock, ensuring the lock is released afterward
 * @param key The lock key
 * @param fn The function to execute with the lock
 * @param ttlMs Lock time-to-live in milliseconds
 * @returns Promise resolving to the function result or null if lock couldn't be acquired
 */
export async function withLock<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs = 30000,
): Promise<T | null> {
  const lockId = await acquireLock(key, ttlMs)

  if (!lockId) {
    return null
  }

  try {
    return await fn()
  } finally {
    await releaseLock(key, lockId)
  }
}
