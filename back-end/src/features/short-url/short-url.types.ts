export type ShortLinkType = "INVITATION" | "WORKSPACE";

export interface CreateShortLinkInput {
    type: ShortLinkType;
    destinationUrl: string;
    ownerId?: string;
    invitationId?: string;
    workspaceId?: string;
    expiresAt?: Date | null;
}

export interface ShortLink {
    id: string | number;
    code: string;
    type?: ShortLinkType;
    destinationUrl: string;
    ownerId: string | null;
    invitationId: string | null;
    workspaceId: string | null;
    isActive: boolean;
    expiresAt: Date | null;
    clickCount: number;
    createdAt: Date;
}
