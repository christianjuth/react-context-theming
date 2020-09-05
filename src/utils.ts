import { IS_DEV, CLASS_PREFIX } from './constants';

const warnings: string[] = [];
export function oneTimeWarn(msg: string) {
  if (warnings.includes(msg)) {
    return;
  }
  console.warn(`React Context Theming: ${msg}`);
  warnings.push(msg);
}



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

export function minifyCSS(css: string) {
  return css.replace(/(\s|\r|\n)+/g, ' ');
}

export function processCSS(css: string) {
  return IS_DEV ? prettyCSS(css) : minifyCSS(css);
}


/**
 * Style API allows the user to specify just a
 * number for many properties with px being inferred.
 * This function adds the px to properties that support
 * this feature.
 * 
 * Example: "padding: 10" becomes "padding: 10px"
 */
export function addUnitToPeropertyIfNeeded(property: string, value: number) {
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
  for(let i = 0; i < match.length; i++) {
    if(property.toLowerCase().indexOf(match[i]) > -1) {
      return value + 'px';
    }
  }
  const exactMatch = [
    'top',
    'right',
    'bottom',
    'left'
  ];
  if(exactMatch.indexOf(property) > -1) {
    return value + 'px';
  }
  return value + '';
}

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

  ObjectKeys(styles).forEach(prop => {
    if ((prop+'').indexOf(':') === 0 || (prop+'').indexOf('@') === 0) {
      Object.assign(output, processSelectorStyles(`${selector}${prop}`, styles[prop]));
      return;
    }

    const val = styles[prop];

    selectorStyles.push({
      prop: prop+'',
      // number values should default to px unit
      value: typeof val === 'number' ? addUnitToPeropertyIfNeeded(prop+'', val) : val+''
    })
  });

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

  ObjectKeys(selectorStyles).forEach(selector => {
    const css = selectorStyles[selector].map(style => `${camelCaseToHyphenated(style.prop)}:${style.value}`).join('; ');
    const className = `${CLASS_PREFIX}-${generateComponentId(selector+css)}`;

    const query = (selector+'').match(/@.*/)?.[0];
    const pseudo = (selector+'').match(/:.*/)?.[0] ?? '';


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
  });

  return output;
}