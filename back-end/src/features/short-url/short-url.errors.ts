export class ShortLinkNotFoundError extends Error {
    statusCode = 404;
    code = "SHORT_LINK_NOT_FOUND";

    constructor() {
        super("Short link does not exist");
    }
}

export class ShortLinkExpiredError extends Error {
    statusCode = 410;
    code = "SHORT_LINK_EXPIRED";

    constructor() {
        super("Short link has expired");
    }
}

export class ShortLinkDisabledError extends Error {
    statusCode = 410;
    code = "SHORT_LINK_DISABLED";

    constructor() {
        super("Short link has been disabled");
    }
}
