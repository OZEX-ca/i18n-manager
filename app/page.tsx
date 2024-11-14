"use client"

import { useEffect, useState } from "react";
import Image from 'next/image';

import { TranslationManager } from "@/components/TranslationManager";
import { TranslationNode } from "@/types";

export default function Home() {
  const languages = ['fr', 'en'];
  const [data, setData] = useState<TranslationNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch('/api/translations');
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  const handleSave = async (updatedTranslations: TranslationNode) => {
    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTranslations),
      });
      
      if (!response.ok) throw new Error('Erreur de sauvegarde');
      setData(updatedTranslations);
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;


  return (
    <div className="w-[60rem] h-full mx-auto">
      <Image className="pt-8" src="/ozex.svg" width={200} height={30} alt="OZEX brand" />
      <TranslationManager 
        initialTranslations={data || {}} 
        languages={languages}
        onSave={handleSave}
      />
    </div>
  );
}
