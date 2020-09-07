import { IS_DEV, CLASS_PREFIX } from './constants';
import { memo } from 'react';

const warnings: string[] = [];
export function oneTimeWarn(msg: string) {
  if (warnings.includes(msg)) {
    return;
  }
  console.warn(`React Context Theming: ${msg}`);
  warnings.push(msg);
}

export function generateComponentId(str: string) {
  return hash(str) >>> 0;
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
export const hash = (((x: string): number => {
  return phash(SEED, x);
}));





export const camelCaseToHyphenated = (str: string) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

export function ObjectKeys<T>(obj: T): (keyof T)[] {
  return Object.keys(obj as any) as (keyof T)[];
}

function fixIndentation(code: string) {
  // detect leading indentaton from first line
  // assume first line should not be indented
  const indentation = code.match(/^(\n|\r)*(\s*)/)?.[2] ?? '';

  // remove extra lines at begining and end
  code = code.replace(/^(\n|\r)+/, '').replace(/(\n|\r)+$/, '');

  const regex = new RegExp(`(^|\n|\r)${indentation}`, 'g');
  code = code.replace(regex, '\n');
  return code;
}

export function prettyCSS(css: string) {
  return fixIndentation(css);
}

export function processCSS(css: string) {
  return IS_DEV ? prettyCSS(css) : css;
}

export function memoize(fn: (arg: string) => any) {
  const cache: Record<string, any> = {};

  return (value: string) => {
    if (cache[value]) {
      return cache[value];
    }

    const output = fn(value);
    cache[value] = output;
    return output;
  }
}

function getAvg(times: number[]) {
  const total = times.reduce((acc, c) => acc + c, 0);
  return total / times.length;
}

export function timer(fn: any) {
  const times: number[] = [];
  return (...args: any) => {
      let t0 = 0;
      if(typeof window !== 'undefined') {
        t0 = performance.now();
      }
      const output = fn(...args);
      let t1 = 0;
      if(typeof window !== 'undefined') {
        t1 = performance.now();
      }
      const diff = t1 - t0;
      times.push(diff);
      console.log(getAvg(times))
      return output;
  }
}


/**
 * Style API allows the user to specify just a
 * number for many properties with px being inferred.
 * This function adds the px to properties that support
 * this feature.
 * 
 * Example: "padding: 10" becomes "padding: 10px"
 */
const needsUnit = ((property: string) => {
  const match = [
    'width',
    'height',
    'padding',
    'margin',
    'radius',
    'spacing',
    'offset',
    'outset',
    'gap'
  ];
  for(const keyword of match) {
    if(property.toLowerCase().indexOf(keyword) > -1) {
      return true;
    }
  }
  const exactMatch = [
    'top',
    'right',
    'bottom',
    'left'
  ];
  if(exactMatch.indexOf(property) > -1) {
    return true;
  }
  return false;
});

function processSelectorStyles<A, B>(selector: A, styles: B): {
  [key: string]: {
    [key: string]: string
  }[]
} {
  const output: any = {};

  let selectorStyles: {
    prop: string,
    value: string
  }[] = [];

  for (const prop of ObjectKeys(styles)) {
    if ((prop+'').indexOf(':') === 0 || (prop+'').indexOf('@') === 0) {
      Object.assign(output, processSelectorStyles(`${selector}${prop}`, styles[prop]));
      continue;
    }

    const val = styles[prop];

    selectorStyles.push({
      prop: prop+'',
      // number values should default to px unit
      value: (typeof val === 'number' && needsUnit(prop+'')) ? val+'px' : val+''
    })
  }

  return {
    [selector+'']: selectorStyles,
    ...output
  };
}

/**
 * This function takes camcelCase style CSS and converts it to 
 * standard CSS that the browser can understand.
 */

export function camelCaseStylesToVanillaCSS<A extends { [key: string]: any }>(styles: A): {
  [key: string]: string;
} {
  let output: Record<string, string> = {};

  const selectorStyles = processSelectorStyles('', styles);

  for (const selector of ObjectKeys(selectorStyles)) {
    const css = selectorStyles[selector].map(style => `${camelCaseToHyphenated(style.prop)}:${style.value}`).join('; ');
    const className = `${CLASS_PREFIX}-${generateComponentId(selector+css)}`;

    const query = (selector+'').match(/@.*/)?.[0];
    const pseudo = (selector+'').match(/:.*/)?.[0] ?? '';

    if (IS_DEV) {
      // handle media queries
      if(query) {
        output[className] = `
          ${query} {
            .${className} { 
              ${css}
            }
          }
        `;
      } 
      
      // default case can handle pseudo selectors
      else {
        output[className] = `
          .${className}${pseudo} { 
            ${css}
          }
        `;
      }
    }

    else {
      // handle media queries
      if(query) {
        output[className] = `${query} { .${className} { ${css} } }`;
      } 
      
      // default case can handle pseudo selectors
      else {
        output[className] = `.${className}${pseudo} { ${css} } `;
      }
    }
  }

  return output;
}