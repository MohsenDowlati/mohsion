import {clearCached, getCached, setCached} from "../../cache/data.cache.js";
import {shortLinkCacheKey} from "../../cache/keys.js";
import type {CreateShortLinkInput} from "./short-url.types.js";


export const getShortLinkCache = <T>(code: string) => getCached<T>(shortLinkCacheKey(code));
export const setShortLinkCache = (code: string, link: unknown, ttl: number) => setCached(shortLinkCacheKey(code), link, ttl);
export const clearShortLinkCache = (code: string) => clearCached(shortLinkCacheKey(code));