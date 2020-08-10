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