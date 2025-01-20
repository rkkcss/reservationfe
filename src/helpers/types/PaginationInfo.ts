export type PaginationInfo = {
    totalPages?: number | 0;      // Az összes oldal száma
    size?: number | 0;            // Az oldal mérete
    number?: number | 0;          // Az aktuális oldal száma (0-al kezdődik)
    first?: boolean;          // Az első oldal-e
    last?: boolean;
    totalElements?: number | 0;
}