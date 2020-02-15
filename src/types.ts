export type ColorSwatch = {
  50: string,
  100: string,
  200: string,
  300: string,
  400: string,
  500: string,
  600: string,
  700: string,
  800: string,
  900: string,
  a100?: string,
  a200?: string,
  a400?: string,
  a700?: string
}

export type Theme = {
  colors: {
    primary: string,
    accent: string,
    background: string,
    surface: string,
    text: string,
    textMuted: string,
    disabled: string,
    placeholder: string,
    backdrop: string,
    divider: string
  },
  font?: {
    regular: string,
    medium: string,
    light: string,
    thin: string
  },
  dark?: boolean,
  roundness?: number
};