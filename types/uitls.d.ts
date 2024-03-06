type ValueOf<T extends Record<any, any>> = T[KeyOf<T>]
type KeyOf<T extends Record<any, any>> = keyof T

