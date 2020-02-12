import * as React from 'react';
import { theme as themeType } from './types';
export declare const Context: React.Context<any>;
export declare function Provider<T extends themeType>({ theme, children }: {
    theme: T;
    children: React.ReactNode;
}): JSX.Element;
export declare function useTheme<T extends themeType>(): T;
