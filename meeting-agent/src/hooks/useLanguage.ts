import { useState, useEffect } from 'react';
import { translations, LanguageCode, TranslationKey, AppTranslations } from '../config/i18n';
import { LOCAL_STORAGE_LANGUAGE_KEY } from '../config/constants';

export const useLanguage = () => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) as LanguageCode) || 'en';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
  }, [language]);

  const cycleLanguage = () => {
    const languageCodes = Object.keys(translations) as LanguageCode[];
    const currentIndex = languageCodes.indexOf(language);
    const nextIndex = (currentIndex + 1) % languageCodes.length;
    setLanguage(languageCodes[nextIndex]);
  };

  const t = (key: TranslationKey): string => {
    const langTranslations = translations[language];
    for (const section of Object.keys(langTranslations)) {
      const typedSection = section as keyof AppTranslations;
      if (
        typeof langTranslations[typedSection] === 'object' &&
        langTranslations[typedSection] !== null &&
        key in (langTranslations[typedSection] as object)
      ) {
        return (langTranslations[typedSection] as any)[key];
      }
    }
    return key;
  };

  return { language, cycleLanguage, t, currentLanguageCode: language.toUpperCase() };
}; 