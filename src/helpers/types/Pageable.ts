export type Pageable<T> = {
    content: T[];            // Az aktuális oldal adatai
    totalElements: number;   // Az összes elem száma
    totalPages: number;      // Az összes oldal száma
    size: number;            // Az oldal mérete
    number: number;          // Az aktuális oldal száma (0-al kezdődik)
    first: boolean;          // Az első oldal-e
    last: boolean;           // Az utolsó oldal-e
}