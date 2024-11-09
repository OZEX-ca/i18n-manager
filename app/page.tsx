import { TranslationManager } from "@/components/TranslationManager";

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



export default function Home() {
  const languages = ['fr', 'en']

  return (
    <TranslationManager initialTranslations={mockTranslations} languages={languages}/>
  );
}
