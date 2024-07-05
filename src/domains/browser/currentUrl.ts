import { BrowserWindow } from '@/domains/types/BrowserWindow';

export const currentUrl = (window: BrowserWindow) => window.location.pathname;
