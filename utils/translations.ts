// route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { TranslationNode } from '@/types';

// Chemins des fichiers
const frPath = path.join(process.cwd(), 'locales', 'fr', 'translation.json');
const enPath = path.join(process.cwd(), 'locales', 'en', 'translation.json');

async function loadTranslations(): Promise<TranslationNode> {
  try {
    // Lecture des fichiers
    const [frContent, enContent] = await Promise.all([
      fs.readFile(frPath, 'utf-8'),
      fs.readFile(enPath, 'utf-8')
    ]);

    // Parse JSON
    const frTranslations = JSON.parse(frContent);
    const enTranslations = JSON.parse(enContent);

    // Fonction récursive pour fusionner les traductions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mergeTranslations = (fr: any, en: any): TranslationNode => {
      const result: TranslationNode = {};

      // Récupère toutes les clés uniques
      const allKeys = new Set([...Object.keys(fr), ...Object.keys(en)]);

      allKeys.forEach(key => {
        const frValue = fr[key];
        const enValue = en[key];

        // Si les deux valeurs sont des objets, on fusionne récursivement
        if (typeof frValue === 'object' && typeof enValue === 'object') {
          result[key] = mergeTranslations(frValue, enValue);
        } else {
          // Sinon on crée un objet avec les traductions
          result[key] = {
            fr: frValue || '',
            en: enValue || ''
          };
        }
      });

      return result;
    };

    return mergeTranslations(frTranslations, enTranslations);

  } catch (error) {
    console.error('Erreur lors du chargement des traductions:', error);
    throw new Error('Échec du chargement des traductions');
  }
}

async function saveTranslations(mergedTranslations: TranslationNode) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const frTranslations: Record<string, any> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enTranslations: Record<string, any> = {}

  // Fonction récursive pour séparer les traductions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splitTranslations = (node: TranslationNode, frObj: any, enObj: any) => {
    Object.entries(node).forEach(([key, value]) => {
      if (value.fr !== undefined && value.en !== undefined) {
        frObj[key] = value.fr
        enObj[key] = value.en
      } else {
        frObj[key] = {}
        enObj[key] = {}
        splitTranslations(value as TranslationNode, frObj[key], enObj[key])
      }
    })
  }

  splitTranslations(mergedTranslations, frTranslations, enTranslations)

  // Écriture des fichiers
  await Promise.all([
    fs.writeFile(frPath, JSON.stringify(frTranslations, null, 2)),
    fs.writeFile(enPath, JSON.stringify(enTranslations, null, 2))
  ])
}

export { loadTranslations, saveTranslations };