import { describe, expect, test } from 'vitest';
import { defineEnum } from '../src';

enum _Language {
  English = 'en',
  Chinese = 'zh',
  Arabic = 'ar',
}

type LanguageMeta = {
  label: string;
  rtl?: boolean;
};

type Language = _Language;
const Language = defineEnum<LanguageMeta>()(_Language, {
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

describe('value test', () => {
  test('Object.keys', () => {
    expect(Object.keys(Language)).toEqual(Object.keys(_Language));
  });

  test('Object.values', () => {
    expect(Object.values(Language)).toEqual(Object.values(_Language));
  });

  test('getMeta', () => {
    expect(Language.getMeta(Language.English)).toEqual({ label: 'English' });
    expect(Language.getMeta(Language.Chinese)).toEqual({ label: 'Chinese' });
    expect(Language.getMeta(Language.Arabic)).toEqual({
      label: 'Arabic',
      rtl: true,
    });
  });

  test('invalid getMeta', () => {
    // @ts-expect-error
    expect(() => Language.getMeta('ja')).toThrow(
      '[getMeta] Invalid enum value',
    );
  });

  test('getMetaList', () => {
    expect(Language.getMetaList()).toEqual([
      { key: 'English', value: 'en', meta: { label: 'English' } },
      { key: 'Chinese', value: 'zh', meta: { label: 'Chinese' } },
      { key: 'Arabic', value: 'ar', meta: { label: 'Arabic', rtl: true } },
    ]);
  });
});
