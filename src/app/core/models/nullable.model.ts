export type Nullable<T> = T | null;

export function nullable<T>(value: T | null | undefined): Nullable<T> {
  return value || null;
}
