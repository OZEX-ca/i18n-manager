"use client"
// components/TranslationGroup.tsx
import { useState, useCallback, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { TranslationNode } from '../types';
import { TableHeader } from './ui/table';

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
          <Table className="w-full mt-4">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left text-gray-500 text-xs">Key</TableHead>
                {languages!.map(lang => (
                  <TableHead key={lang} className="text-left text-gray-500 text-xs">Value in {lang}</TableHead>
                ))}
                <TableHead className="text-right text-gray-500 text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(group).map(([key, value]) => {
                if (typeof value !== 'object' || ('fr' in value)) {
                  return (
                    <TableRow key={key} className="border-t">
                      <TableCell className="py-2">{key}</TableCell>
                      {languages!.map(lang => (
                        <TableCell key={lang} className="py-2">
                          <Input
                            value={(value as { [lang: string]: string })[lang] || ''}
                            onChange={(e) => onUpdate([groupKey, key], lang, e.target.value)}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="py-2 text-right">
                        <Button variant="outline" size="sm" onClick={() => onDelete([groupKey, key])}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                }
              })}
            </TableBody>
          </Table>

        <div className="flex items-center space-x-4 p-3 pr-2 mb-4 bg-gray-50 border-t border-gray-200">
          <Input
            className="bg-white"
            placeholder={`New key for ${groupKey}`}
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <Button size="sm" onClick={handleAdd} onKeyDown={handleKeyPress}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

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
                }
              })}
        
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}