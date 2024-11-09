// types.ts
export interface TranslationValue {
  [lang: string]: string;
}

export interface TranslationNode {
  [key: string]: TranslationNode | TranslationValue;
}

export interface TranslationPath {
  path: string[];
  key: string;
}
