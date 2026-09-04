import { customAlphabet } from "nanoid";

const alphabet =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateCode = customAlphabet(alphabet, 8);

export function createShortCode(): string {
    return generateCode();
}