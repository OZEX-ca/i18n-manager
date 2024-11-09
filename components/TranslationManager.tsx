"use client"

// TranslationManager.tsx
import { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import { TranslationGroup } from '@/components/TranslationGroup';
import { createNestedCategories } from '@/utils/createdNestedCategories';
import { useTranslations } from '@/hooks/useTranslations';
import { TranslationNode } from '@/types';

interface TranslationManagerProps {
  initialTranslations?: TranslationNode;
  onSave?: (translations: TranslationNode) => Promise<void>;
  languages: string[];
}

export const TranslationManager: React.FC<TranslationManagerProps> = ({
  initialTranslations = {},
  onSave,
  languages
}) => {
  const {
    translations,
    updateTranslation,
    deleteTranslation,
    addTranslation,
    setTranslations,
    error,
    setError
  } = useTranslations({ initialTranslations, languages });

  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await onSave(translations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = useCallback(() => {
    if (!newCategory.trim()) {
      setError("La catégorie ne peut pas être vide");
      return;
    }
  
    try {
      const updatedTranslations = createNestedCategories({
        categoryPath: newCategory,
        translations,
        languages
      });
      
      setTranslations(updatedTranslations);
      setNewCategory('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    }
  }, [newCategory, translations, languages, setError, setTranslations]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestionnaire de traductions</h1>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      
      <div className="space-y-2">
      <Card>
        <CardHeader>
          <h2>Traductions</h2>
          <div className="flex gap-2 items-center mt-4">
            <Input
              placeholder="Nouvelle catégorie (utiliser / pour imbriquer)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>
              Ajouter
            </Button>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {Object.entries(translations).map(([key, value]) => (
            <TranslationGroup
              key={key}
              groupKey={key}
              group={value as TranslationNode}
              onUpdate={updateTranslation}
              onDelete={deleteTranslation}
              onAdd={addTranslation}
              languages={languages}
            />
          ))}
        </CardContent>
      </Card>

      </div>
    </div>
  );
}