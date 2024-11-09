'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react'

// Structure de données simulée
const mockTranslations = {
  button: {
    start: { fr: "Commencer", en: "Start" },
    next: { fr: "Suivant", en: "Next" },
    previous: { fr: "Précédent", en: "Previous" },
    home: { fr: "Accueil", en: "Home" },
    identify: { fr: "Identifier", en: "Identify" },
  },
  header: {
    title: { fr: "Titre", en: "Title" },
    subtitle: { fr: "Sous-titre", en: "Subtitle" },
  }
}

const languages = ['fr', 'en']

type TranslationNode = {
  [key: string]: TranslationNode | { [lang: string]: string }
}

const TranslationGroup = ({ groupKey, group, onUpdate, onDelete, onAdd, level = 0 }: {
  groupKey: string,
  group: TranslationNode,
  onUpdate: (path: string[], lang: string, value: string) => void,
  onDelete: (path: string[]) => void,
  onAdd: (path: string[], newKey: string) => void,
  level?: number
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [newKey, setNewKey] = useState('')

  const handleAdd = () => {
    if (newKey) {
      onAdd([groupKey], newKey)
      setNewKey('')
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center space-x-2 py-2">
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="font-semibold">{groupKey}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-4">
          {Object.entries(group).map(([key, value]) => {
            if (typeof value === 'object' && !('fr' in value)) {
              return (
                <TranslationGroup
                  key={key}
                  groupKey={key}
                  group={value as TranslationNode}
                  onUpdate={(path, lang, newValue) => onUpdate([groupKey, ...path], lang, newValue)}
                  onDelete={(path) => onDelete([groupKey, ...path])}
                  onAdd={(path, newKey) => onAdd([groupKey, ...path], newKey)}
                  level={level + 1}
                />
              )
            } else {
              return (
                <div className='flex gap-4 w-full mt-4 justify-center items-center' key={key}>
                  <div className='w-28'>{key}</div>
                  {languages.map(lang => (
                    <div className='flex-1' key={lang}>
                      <Input
                        value={(value as { [lang: string]: string })[lang] || ''}
                        onChange={(e) => onUpdate([groupKey, key], lang, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className="flex-1 text-right">
                    <Button variant="destructive" size="sm" onClick={() => onDelete([groupKey, key])}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            }
          })}
          <div className="flex items-center space-x-2 mt-4 mb-">
            <Input
              placeholder={`Nouvelle clé pour ${groupKey}`}
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Button size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function TranslationManagerComponent() {
  const [translations, setTranslations] = useState<TranslationNode>(mockTranslations)
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    // Ici, vous chargeriez normalement les traductions depuis vos fichiers JSON
    setTranslations(mockTranslations)
  }, [])

  const handleUpdate = (path: string[], lang: string, value: string) => {
    setTranslations(prev => {
      const newTranslations = JSON.parse(JSON.stringify(prev))
      let current = newTranslations
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]][lang] = value
      return newTranslations
    })
  }

  const handleDelete = (path: string[]) => {
    setTranslations(prev => {
      const newTranslations = JSON.parse(JSON.stringify(prev))
      let current = newTranslations
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      delete current[path[path.length - 1]]
      return newTranslations
    })
  }

  const handleAdd = (path: string[], newKey: string) => {
    setTranslations(prev => {
      const newTranslations = JSON.parse(JSON.stringify(prev));
      let current = newTranslations;
      for (const key of path) {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
      const keys = newKey.split('/').filter(Boolean);
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = languages.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {});
        } else {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
      });
      return newTranslations;
    });
  };

  const handleAddCategory = () => {
    if (newCategory) {
      const categories = newCategory.split('/').filter(Boolean);
      setTranslations(prev => {
        const current = {...prev};
        let pointer = current;
        categories.forEach((category, index) => {
          if (!pointer[category]) {
            pointer[category] = index === categories.length - 1 ? {} : {};
          }
          pointer = pointer[category];
        });
        return current;
      });
      setNewCategory('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestionnaire de traductions</h1>
      <Card >
        <CardHeader>
          <div className="mt-4 flex items-center space-x-2">
            <Input
              placeholder="Nouvelle catégorie (ex: page/login)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAddCategory}>
              Ajouter une catégorie
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {Object.entries(translations).map(([key, value]) => (
            <TranslationGroup
              key={key}
              groupKey={key}
              group={value as TranslationNode}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}