import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'preferred-language';
  private readonly platformId = inject(PLATFORM_ID);
  private translateService = inject(TranslateService);

  readonly currentLanguage = signal<Language>(this.getInitialLanguage());
  readonly isRTL = signal<boolean>(this.currentLanguage() === 'ar');

  constructor() {
    // Initialize translate service
    this.translateService.setDefaultLang('en');
    this.translateService.addLangs(['en', 'ar']);
    
    // Apply initial language
    this.applyLanguage(this.currentLanguage());

    // Effect to handle language changes
    effect(() => {
      const lang = this.currentLanguage();
      this.applyLanguage(lang);
      this.saveLanguagePreference(lang);
    });
  }

  private getInitialLanguage(): Language {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === 'en' || saved === 'ar') {
        return saved;
      }
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ar') {
        return 'ar';
      }
    }
    return 'en';
  }

  private applyLanguage(lang: Language): void {
    this.translateService.use(lang);
    this.isRTL.set(lang === 'ar');
    
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.body.classList.toggle('rtl', lang === 'ar');
    }
  }

  private saveLanguagePreference(lang: Language): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  getLanguageLabel(lang: Language): string {
    return lang === 'en' ? 'English' : 'العربية';
  }
}

