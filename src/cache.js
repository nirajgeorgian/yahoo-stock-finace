import { promisify } from "util";
import redis from "redis";

export const cache = redis.createClient();
export const getAsync = promisify(cache.get).bind(cache);
export const setAsync = promisify(cache.setex).bind(cache);
export const getTimeLeft = promisify(cache.ttl).bind(cache);
