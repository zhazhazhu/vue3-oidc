import { VueOidcSettings } from "./store";

export type MaybeNull<T> = T | null;

export interface RefreshTokenConfig {
  enable?: boolean;
  time?: number;
  settings?: VueOidcSettings | null;
}
