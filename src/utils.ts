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



const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const warnings: string[] = [];
function oneTimeWarn(msg: string) {
  if (warnings.includes(msg)) {
    return;
  }
  console.warn(`React Context Theming: ${msg}`);
  warnings.push(msg);
}

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

export function prettyCSS(css: string) {
  return css;
}

export function minifyCSS(css: string) {
  return css.replace(/(\s|\r|\n)+/g, ' ');
}

export function processCSS(css: string) {
  return isDev ? prettyCSS(css) : minifyCSS(css);
}

/**
 * Remove pseudo and media queries
 */
export function removeCSSExtras<A>(styles: A): A {
  let output: any = {};

  ObjectKeys(styles).forEach(selector => {
    output[selector] = {};

    ObjectKeys(styles[selector]).forEach(prop => {
      if (/(:|@)/.test(prop+'')) {
        oneTimeWarn('Some pseudo and media queries were removed at runtime. This usually happens when you pass pseudo classes or media queries into useStyleCreator instead of useStyleCreatorClassNames.');
        return;
      } 
      
      output[selector][prop] = styles[selector][prop];
    })
  });

  return output;
}