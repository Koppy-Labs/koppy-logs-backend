import { redis } from '@/libs/redis'

export const ONE_MONTH_IN_SECONDS = 30 * 24 * 60 * 60
export const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60
export const ONE_DAY_IN_SECONDS = 24 * 60 * 60
export const ONE_HOUR_IN_SECONDS = 60 * 60

export const setCache = async (key: string, value: string, ttl: number) => {
  await redis.set(key, value, 'EX', ttl)
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedData = await redis.get(key)

    if (!cachedData) return null

    return JSON.parse(cachedData) as T
  } catch (error) {
    console.error(`Failed to get or parse cache for key ${key}:`, error)

    return null
  }
}

export const deleteCache = async (key: string) => {
  await redis.del(key)
}
