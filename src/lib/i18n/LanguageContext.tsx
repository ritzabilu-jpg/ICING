'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang, LANGS, translations, Translations } from './translations';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Translations) => string;
  dir: 'rtl' | 'ltr';
}

const Ctx = createContext<LangCtx>({
  lang: 'he', setLang: () => {}, t: () => '', dir: 'rtl',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('he');

  useEffect(() => {
    const saved = localStorage.getItem('site_lang') as Lang | null;
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('site_lang', l);
    const langMeta = LANGS.find(x => x.code === l)!;
    document.documentElement.dir = langMeta.dir;
    document.documentElement.lang = l;
  }

  function t(key: keyof Translations): string {
    return translations[lang]?.[key] ?? translations['he'][key] ?? key;
  }

  const dir = LANGS.find(x => x.code === lang)?.dir ?? 'rtl';
  return <Ctx.Provider value={{ lang, setLang, t, dir }}>{children}</Ctx.Provider>;
}

export function useLanguage() { return useContext(Ctx); }
