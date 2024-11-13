"use client"

// TranslationManager.tsx
import { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
      setError(err instanceof Error ? err.message : 'An error has occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = useCallback(() => {
    if (!newCategory.trim()) {
      setError("Category cannot be empty");
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
      setError(err instanceof Error ? err.message : "Error during creation");
    }
  }, [newCategory, translations, languages, setError, setTranslations]);

  return (
    <div className="w-[60rem] h-full mx-auto py-12 space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="space-y-2">
      <Card>
        <CardHeader className='sticky top-0 z-10 border-b mb-4 rounded-tr-xl rounded-tl-xl bg-white'>
          <CardTitle>Translation Management</CardTitle>
          <CardDescription>
            Effortlessly manage all your translations in one place
          </CardDescription>
          <div className="flex gap-2 items-center pt-4 justify-between">
            <div className='flex gap-2'>
              <div className='flex flex-col gap-2' >
                <Input
                  className='w-96'
                  placeholder="New category (use / to nest)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                />
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>
              <Button onClick={handleAddCategory}>
                Add category
              </Button>

            </div>

            <span>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAllOpen(!isAllOpen);
                }}
                className="mr-2"
              >
                {isAllOpen ? 'Collapse all' : 'Expand all'}
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
              >
                  {isLoading ? 'Save...' : 'Save'}
              </Button>
            </span>
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