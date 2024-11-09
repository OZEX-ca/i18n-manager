import { TranslationNode, TranslationValue } from "@/types";

// hooks/useTranslations.ts
import { useState, useCallback } from 'react';

interface UseTranslationsProps {
  initialTranslations: TranslationNode;
  languages: string[];
}

export const useTranslations = ({ initialTranslations, languages }: UseTranslationsProps) => {
  const [translations, setTranslations] = useState<TranslationNode>(initialTranslations);
  const [error, setError] = useState<string | null>(null);

  const updateTranslation = useCallback((path: string[], lang: string, value: string) => {
    setTranslations(prev => {
      try {
        const newTranslations = { ...prev };
        let current = newTranslations;
        
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]] as TranslationNode;
        }
        
        const lastKey = path[path.length - 1];
        const translations = current[lastKey] as TranslationValue;
        current[lastKey] = { ...translations, [lang]: value };
        
        return newTranslations;
      } catch (err) {
        console.error('Error updating translation:', err);
        return prev;
      }
    });
  }, []);

  const deleteTranslation = useCallback((path: string[]) => {
    setTranslations(prev => {
      try {
        const newTranslations = { ...prev };
        let current = newTranslations;
        
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]] as TranslationNode;
        }
        
        delete current[path[path.length - 1]];
        return newTranslations;
      } catch (err) {
        console.error('Error deleting translation:', err);
        return prev;
      }
    });
  }, []);

  const addTranslation = useCallback((path: string[], newKey: string) => {
    setTranslations(prev => {
      try {
        const newTranslations = { ...prev };
        let current = newTranslations;

        // Navigation to target node
        for (const key of path) {
          current = current[key] as TranslationNode;
        }

        // Create empty translations for new key
        const emptyTranslations = languages.reduce<TranslationValue>((acc, lang) => {
          acc[lang] = '';
          return acc;
        }, {});

        current[newKey] = emptyTranslations;
        return newTranslations;
      } catch (err) {
        console.error('Error adding translation:', err);
        return prev;
      }
    });
  }, [languages]);

  return {
    translations,
    setTranslations,
    updateTranslation,
    deleteTranslation,
    addTranslation,
    error,
    setError
  };
};