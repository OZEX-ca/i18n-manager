"use client"

// TranslationManager.tsx
import { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"


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
  const [isAllOpen, setIsAllOpen] = useState(true);

  const toggleAll = useCallback(() => {
    setIsAllOpen(prev => !prev);
  }, []);

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
          <CardTitle>Gestion des Traduction</CardTitle>
          <div className="flex gap-2 items-center pt-4 justify-between">
            <div className='flex gap-2'>
              <div className='flex flex-col gap-2' >
                <Input
                  className='w-96'
                  placeholder="Nouvelle catégorie (utiliser / pour imbriquer)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                />
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>
              <Button onClick={handleAddCategory}>
                Ajouter
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsAllOpen(!isAllOpen);
              }}
              className="mr-2"
            >
              {isAllOpen ? 'Tout fermer' : 'Tout ouvrir'}
            </Button>
          </div>
        </CardHeader>
        <Separator />
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
              isAllOpen={isAllOpen}
              onToggleAll={toggleAll}
            />
          ))}
        </CardContent>
      </Card>

      </div>
    </div>
  );
}