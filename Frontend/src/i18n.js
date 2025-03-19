import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          home: "Home",
          product: "Product",
          about: "About Us",
          contact: "Contact Us",
          makeup: "Makeup",
          skincare: "Skin Care",
          haircare: "Hair Care",
          fragrances: "Fragrances",
          language: "Language",
          welcome: "Welcome to",
          about_desc: "where beauty meets quality. Our mission is to bring you the finest skincare and cosmetic products, crafted with love and care.",
          our_story: "Our Story",
          our_story_desc: "Founded in 2020, Glow Essence was born out of a passion for high-quality, cruelty-free cosmetics. We believe that beauty should be accessible to all while maintaining ethical and sustainable practices.",
          our_values: "Our Values",
          natural_ingredients: "100% Natural Ingredients",
          cruelty_free: "Cruelty-Free & Vegan",
          dermatologically_tested: "Dermatologically Tested",
          sustainable_packaging: "Sustainable & Eco-Friendly Packaging",
          contact: "Contact Us",
          contact_desc: "Get in touch with us for any queries, support, or business inquiries.",
          our_details: "Our Details",
          email: "Email",
          phone: "Phone",
          location: "Location",
        },
      },
      fr: {
        translation: {
          home: "Accueil",
          product: "Produit",
          about: "À propos",
          contact: "Contactez-nous",
          makeup: "Maquillage",
          skincare: "Soins de la peau",
          haircare: "Soins capillaires",
          fragrances: "Parfums",
          language: "Langue",
          welcome: "Bienvenue à",
          about_desc: "où la beauté rencontre la qualité. Notre mission est de vous apporter les meilleurs produits de soins et cosmétiques, fabriqués avec amour et soin.",
          our_story: "Notre histoire",
          our_story_desc: "Fondée en 2020, Glow Essence est née d'une passion pour les cosmétiques de haute qualité et sans cruauté. Nous croyons que la beauté devrait être accessible à tous tout en respectant des pratiques éthiques et durables.",
          our_values: "Nos valeurs",
          natural_ingredients: "Ingrédients 100% naturels",
          cruelty_free: "Sans cruauté et végétalien",
          dermatologically_tested: "Testé dermatologiquement",
          sustainable_packaging: "Emballage durable et respectueux de l'environnement",
          contact: "Contactez-nous",
          contact_desc: "Contactez-nous pour toute question, assistance ou demande commerciale.",
          our_details: "Nos Coordonnées",
          email: "E-mail",
          phone: "Téléphone",
          location: "Emplacement",
        },
      },
    },
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
