import { DefaultTheme, UserConfig } from 'vitepress';
export interface ThemeConfig extends DefaultTheme.Config {
}
export declare const defineConfig: (config: UserConfig<ThemeConfig>) => Promise<UserConfig<ThemeConfig>>;
