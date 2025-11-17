
export const BASIC_ENTITY_STATUSES = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    DELETED: "DELETED"
} as const;

export type BasicEntityStatus =
    typeof BASIC_ENTITY_STATUSES[keyof typeof BASIC_ENTITY_STATUSES];
