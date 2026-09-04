import type {Request, Response, NextFunction} from "express";
import { resolveShortLink, registerClick } from "./short-url.service.js";
import {
    ShortLinkDisabledError,
    ShortLinkExpiredError,
    ShortLinkNotFoundError,
} from "./short-url.errors.js";

export async function redirectShortLink(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { code } = req.params;

        if (typeof code !== 'string') {
            res.status(400).json({ error: "Invalid code format" });
            return;
        }

        const link = await resolveShortLink(code);

        if (!link) {
            throw new ShortLinkNotFoundError();
        }

        if (!link.isActive) {
            throw new ShortLinkDisabledError();
        }

        if (
            link.expiresAt &&
            new Date(link.expiresAt).getTime() <= Date.now()
        ) {
            throw new ShortLinkExpiredError();
        }

        void registerClick(link.id).catch((error) => {
            console.error("Failed to register click:", error);
        });

        return res.redirect(302, link.destinationUrl);
    } catch (error) {
        return next(error);
    }
}
