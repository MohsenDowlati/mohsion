export function calculateCacheTtl(expiresAt: Date | null | undefined): number {
    if (!expiresAt) {
        return 60 * 60 * 24;
    }

    const seconds = Math.floor(
        (expiresAt.getTime() - Date.now()) / 1000,
    );

    return Math.max(seconds, 1);
}



