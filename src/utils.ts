import { useTheme } from './context';

export function useStyles(styleFn: any) {
  const theme = useTheme();
  return styleFn(theme);
}