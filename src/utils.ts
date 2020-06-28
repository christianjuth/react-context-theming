import * as React from 'react';

const AD_REPLACER_R = /(a)(d)/gi;

/* This is the "capacity" of our alphabet i.e. 2x26 for all letters plus their capitalised
 * counterparts */
const charsLength = 52;

/* start at 75 for 'a' until 'z' (25) and then start at 65 for capitalised letters */
const getAlphabeticChar = (code: number): string =>
  String.fromCharCode(code + (code > 25 ? 39 : 97));

/* input a number, usually a hash and convert it to base-52 */
export function generateAlphabeticName(code: number): string {
  let name = '';
  let x;

  /* get a char and divide by alphabet-length */
  for (x = Math.abs(code); x > charsLength; x = (x / charsLength) | 0) {
    name = getAlphabeticChar(x % charsLength) + name;
  }

  return (getAlphabeticChar(x % charsLength) + name).replace(AD_REPLACER_R, '$1-$2');
}




export function generateComponentId (str: string): string {
  return generateAlphabeticName(hash(str) >>> 0);
};




export const SEED = 5381;

// When we have separate strings it's useful to run a progressive
// version of djb2 where we pretend that we're still looping over
// the same string
export const phash = (h: number, x: string): number => {
  let i = x.length;

  while (i) {
    h = (h * 33) ^ x.charCodeAt(--i);
  }

  return h;
};

// This is a djb2 hashing function
export const hash = (x: string): number => {
  return phash(SEED, x);
};

export const camelCaseToHyphenated = (str: string) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

export const cssNormalizeValue = (value: string) => {
  if(value.indexOf('#') > -1 || value.indexOf('var(')) {
    return value;
  } else {
    return camelCaseToHyphenated(value);
  }
};

export function ObjectKeys<T>(obj: T): (keyof T)[] {
  return Object.keys(obj as any) as (keyof T)[];
}

export function genearteId() {
  return Date.now() + '';
}

export function useId() {
  const [id, setId] = React.useState(genearteId());
  React.useEffect(() => {
    setId(genearteId());
  }, []);
  return id;
}