import { useTheme } from './context';
export function useStyles(styleFn) {
    const theme = useTheme();
    return styleFn(theme);
}
