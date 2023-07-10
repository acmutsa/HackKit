export type DeArray<T> = T extends (infer R)[] ? R : T;
