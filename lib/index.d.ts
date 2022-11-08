import { DefaultTheme, UserConfig } from 'vitepress';
export interface ThemeConfig extends Omit<DefaultTheme.Config, 'socialLinks'> {
    socialLinks: ThemeConfig.SocialLink[];
}
export declare namespace ThemeConfig {
    interface SocialLink {
        icon: string;
        link: string;
    }
}
export declare const defineConfig: (config: UserConfig<ThemeConfig>) => Promise<UserConfig<ThemeConfig>>;
