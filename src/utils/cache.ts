import { redis } from '@/libs/redis'

export const ONE_MINUTE_IN_SECONDS = 30 * 24 * 60 * 60
export const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60
export const ONE_DAY_IN_SECONDS = 24 * 60 * 60
export const ONE_HOUR_IN_SECONDS = 60 * 60

export const setCache = async (key: string, value: string, ttl: number) => {
  await redis.set(key, value, 'EX', ttl)
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  const cachedData = await redis.get(key)

  return cachedData ? (JSON.parse(cachedData) as T) : null
}

export const deleteCache = async (key: string) => {
  await redis.del(key)
}
