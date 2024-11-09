"use client"
// components/TranslationGroup.tsx
import { useState, useCallback, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { TranslationNode } from '../types';

interface TranslationGroupProps {
  groupKey: string;
  group: TranslationNode;
  onUpdate: (path: string[], lang: string, value: string) => void;
  onDelete: (path: string[]) => void;
  onAdd: (path: string[], newKey: string) => void;
  onToggleAll: () => void;
  languages: string[];
  level?: number;
  isAllOpen?: boolean;
}

export const TranslationGroup: React.FC<TranslationGroupProps> = ({
  groupKey,
  group,
  onUpdate,
  onDelete,
  onAdd,
  languages,
  level = 0,
  isAllOpen = false,
  onToggleAll
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newKey, setNewKey] = useState('');

  // Synchroniser avec l'état global
  useEffect(() => {
    if (isAllOpen !== undefined) {
      setIsOpen(isAllOpen);
    }
  }, [isAllOpen]);

  const handleAdd = useCallback(() => {
    if (newKey.trim()) {
      onAdd([groupKey], newKey);
      setNewKey('');
    }
  }, [groupKey, newKey, onAdd]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  }, [handleAdd]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>

      <CollapsibleTrigger className="flex items-center space-x-2 py-2 hover:bg-gray-50 w-full">
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="font-semibold">{groupKey}</span>
      </CollapsibleTrigger>


      <CollapsibleContent className="pl-4">
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
                languages={languages}
                isAllOpen={isAllOpen}
                onToggleAll={onToggleAll}
              />
            )
          } else {
            return (
              <div className='flex gap-4 w-full mt-4 justify-center items-center' key={key}>
                <div className='w-28 min-w-min'>{key}</div>
                {languages!.map(lang => (
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
        <div className="flex items-center space-x-2 mt-4 mb-8">
          <Input
            placeholder={`Nouvelle clé pour ${groupKey}`}
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <Button size="sm" onClick={handleAdd} onKeyDown={handleKeyPress}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}