import {CLIENT_APP_URL} from "../config/env.js";
import makeError from "./makeError.js";

export function assertAllowedDestination(url: string): void {
    try {
        const parsed = new URL(url);
        let PUBLIC_APP_URL;
        const allowedBaseUrl = CLIENT_APP_URL || PUBLIC_APP_URL;
        if (!allowedBaseUrl) {
            throw makeError("Allowed application URL is not configured", 500);
        }

        const allowedHost = new URL(allowedBaseUrl).host;

        if (!["http:", "https:"].includes(parsed.protocol) || parsed.host !== allowedHost) {
            throw makeError("Destination URL is not allowed", 400);
        }
    } catch (err: any) {
        if (err.statusCode) throw err;
        throw makeError("Invalid destination URL format", 400);
    }
}