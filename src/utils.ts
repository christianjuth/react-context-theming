import { IS_DEV, CLASS_PREFIX } from './constants';

const warnings: string[] = [];
export function oneTimeWarn(msg: string) {
  if (warnings.includes(msg)) {
    return;
  }
  console.warn(`React Context Theming: ${msg}`);
  warnings.push(msg);
}

export const camelCaseToHyphenated = (str: string) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

export function ObjectKeys<T>(obj: T): (keyof T)[] {
  return Object.keys(obj as any) as (keyof T)[];
}

function fixIndentation(code: string) {
  // remove extra lines at begining and end
  code = code.replace(/^(\s)*(\n|\r)+/, '').replace(/(\n|\r)+(\s)*$/, '');

  // detect leading indentaton from first line
  // assume first line should not be indented
  const indentation = code.match(/^\s*/)?.[0] ?? '';

  code = code.replace(indentation, '');
  const regex = new RegExp(`(\n|\r)${indentation}`, 'g');
  code = code.replace(regex, '\n');
  return code;
}

export function prettyCSS(css: string) {
  return fixIndentation(css).replace(/(\n|\r)\./g, '\n\n\n.');
}

export function minifyCSS(css: string) {
  return css.replace(/(\s|\r|\n)+/g, '');
}

export function processCSS(css: string) {
  return IS_DEV ? prettyCSS(css) : minifyCSS(css);
}

/**
 * Remove pseudo and media queries
 */
export function removeClassOnlyStyles<A>(styles: A): A {
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
export function camelCaseStylesToVanillaCSS<A extends { [key: string]: any }>(styles: A, id: string): {
  [key: string]: string;
} {
  let output: Record<string, string> = {};

  ObjectKeys(styles).forEach(async (key) => {
    const selectorStyles = processSelectorStyles(key, styles[key]);
    const className = `${CLASS_PREFIX}${id}-${key}`;

    ObjectKeys(selectorStyles).forEach(selector => {
      const query = (selector+'').match(/@.*/)?.[0];
      const pseudo = (selector+'').match(/:.*/)?.[0] ?? '';

      // handle media queries
      if(query) {
        output[selector] = `
          ${query} {
            .${className} { 
              ${selectorStyles[selector].map(style => `${camelCaseToHyphenated(style.prop)}:${style.value}`).join(';')}
            }
          }
        `;
      } 
      
      // default case can handle pseudo selectors
      else {
        output[selector] = `
          .${className}${pseudo} { 
            ${selectorStyles[selector].map(style => `${camelCaseToHyphenated(style.prop)}:${style.value}`).join(';')}
          }
        `;
      }
    })
  });

  return output;
}