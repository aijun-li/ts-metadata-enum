# TS Metadata Enum

This works as an extension to TypeScript Enum, which can attach metadata to each Enum member with type suggestion.

## Usage

### Define Enum

TypeScript is a remix of values and types. To attach metadata, we will split the value/type part of Enum, make some modifications to the value part, and then remix them again.

```typescript
// enum.ts

import { defineEnum } from 'ts-metadata-enum';

// define your raw Enum (with '_' prefix as we will not use it directly )
enum _Language {
  English = 'en',
  Chinese = 'zh',
  Arabic = 'ar',
}

// define typeof metadata
type LanguageMeta = {
  label: string;
  rtl?: boolean;
};

// export type of Enum
export type Language = _Language;

// export value of Enum, with metadata attached (don't forget the empty '()')
export const Language = defineEnum<LanguageMeta>()(_Language, {
  English: {
    label: 'English',
  },
  Chinese: {
    label: 'Chinese',
  },
  Arabic: {
    label: 'Arabic',
    rtl: true,
  },
});

// you may need to turn off no-redeclare if eslint complains
```

### Use Enum

`defineEnum` will add two methods on the Enum:

- `getMeta` - return the metadata for a single member
-  `getMetaList` - return the metadata list for all members 

```typescript
// index.ts

import { Language } from './enum';

// zh
Language.Chinese;

// { label: 'Arabic', rtl: true }
Language.getMeta(Language.Arabic); 

// [
//   { key: 'English', value: 'en', meta: { label: 'English' } },
//   { key: 'Chinese', value: 'zh', meta: { label: 'Chinese' } },
//   { key: 'Arabic', value: 'ar', meta: { label: 'Arabic', rtl: true } }
// ]
Language.getMetaList();


/**
 * NOTICE: 
 * if multiple members have same value,
 * getMeta will only return metadata attached to the first member
 */

```

