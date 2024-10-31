const ENUM_META_KEY = Symbol('MetaEnum');

type KeyOf<T> = {
  [K in keyof T]: T[K] extends Function ? never : K extends symbol ? never : K;
}[Exclude<keyof T, 'prototype'>];

type ValueOf<T> = T[KeyOf<T>];

type WithMetaSymbol<T, U> = { [ENUM_META_KEY]: { [key in keyof T]: U } };

type WithMetaMethods<T, U> = {
  getMeta: <This extends WithMetaSymbol<T, U>>(
    this: This,
    value: ValueOf<This>,
  ) => This extends WithMetaSymbol<T, infer Meta> ? Meta : never;

  getMetaList: <This extends WithMetaSymbol<T, U>>(
    this: This,
  ) => This extends WithMetaSymbol<T, infer Meta>
    ? Array<
        {
          [K in KeyOf<This>]: {
            key: K;
            value: This[K];
            meta: Meta;
          };
        }[KeyOf<This>]
      >
    : never;
};

type MetaEnum<T, U> = T & WithMetaSymbol<T, U> & WithMetaMethods<T, U>;

export function defineEnum<U extends Record<string, unknown>>() {
  return <T extends Record<string, string | number>>(
    enumObj: T,
    metaObj: { [key in keyof T]: U },
  ) => {
    Object.defineProperty(enumObj, 'getMeta', {
      value: (value: ValueOf<T>) => {
        const meta = Object.entries(metaObj).find(
          ([key]) => enumObj[key] === value,
        )?.[1];
        if (!meta) {
          throw new Error('[getMeta] Invalid enum value');
        }
        return meta;
      },
    });

    Object.defineProperty(enumObj, 'getMetaList', {
      value: () =>
        Object.entries(metaObj).map(([key, meta]) => ({
          key,
          value: enumObj[key],
          meta,
        })),
    });

    return enumObj as MetaEnum<T, U>;
  };
}
