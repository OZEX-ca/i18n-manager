import { TranslationNode, TranslationValue } from '@/types';

interface CreateCategoryOptions {
  categoryPath: string;
  translations: TranslationNode;
  languages: string[];
}

export const createNestedCategories = ({
  categoryPath,
  translations,
  languages
}: CreateCategoryOptions): TranslationNode => {
  const paths = categoryPath.split('/').filter(Boolean);
  
  if (paths.length === 0) {
    throw new Error("Le chemin de catégorie est invalide");
  }

  const result = { ...translations };
  let current = result;

  paths.forEach((path, index) => {
    const isLastLevel = index === paths.length - 1;

    if (!current[path]) {
      if (isLastLevel) {
        // Créer les traductions vides pour le dernier niveau
        current[path] = languages.reduce((acc, lang) => {
          acc[lang] = '';
          return acc;
        }, {} as TranslationValue);
      } else {
        // Créer un noeud intermédiaire
        current[path] = {};
      }
    }
    
    if (!isLastLevel) {
      current = current[path] as TranslationNode;
    }
  });

  return result;
};