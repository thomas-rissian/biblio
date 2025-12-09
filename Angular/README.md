# Biblio — Frontend Angular

Bienvenue dans le frontend Angular de Biblio : une petite application de gestion de bibliothèque (livres, auteurs, catégories, statistiques).

Ce projet est construit avec Angular 21, utilise des composants standalone, une librairie interne `libs/` pour les composants réutilisables, et `libs/core` pour les services et validators.


## Vue d'ensemble

- Application principale : `apps/biblio-app`
- Librairies internes : `libs/ui` (composants réutilisables), `libs/core` (services, validations)
- API backend : Le backend Node/Express/Prisma est situé dans `API/` (dossier racine du repo)


## Structure du projet (essentiel)
- `apps/` — possibilité de mettre plusieurs "applicatifs"
- `apps/biblio-app` — Application Angular principale
	- `src/app/pages` — pages : books, authors, categories, statistique
	- `src/app/core` — services, config et validators : appel API + vérification
    - `src/app/components` — composant réutilisable seulement dans le projet
    - `src/app/model` — model ressemblant de l'API
	- `index.html`, `main.ts`, `styles.css` — points d'entrée et styles
- `libs/ui` — composants réutilisables dans tous les projets
- `libs/core` — services (ex message d'erreur auto)

## Fonctionnalités principales

- Gestion des livres (CRUD)
- Gestion des auteurs (CRUD)
- Gestion des catégories (CRUD)
- Statistiques (visualisations D3)
- UI réutilisables (composants, listes, inputs, édition)


## Prérequis & environnements

- Node.js (recommandé : 18+ / 20+) et npm (le projet a été testé avec npm 10)
- Angular CLI v21 (optionnel si vous utilisez `npm run` scripts)


## Connexion au backend

L'API attendue se trouve dans `API/` : démarrez-la via `API/package.json` si vous avez besoin des endpoints.

- URL par défaut : `http://localhost:3000/api/v1`
- Modifier la configuration : `apps/biblio-app/src/app/core/config/config.ts`

## Installation rapide

1) Installer les dépendances (depuis la racine du workspace) :

```shell
cd Angular
npm install
```

2) Démarrer le frontend en mode développement :

```shell
npm run start
```
3) Démarez BACKEND API 

4) Ouvrez le navigateur sur : `http://localhost:4200`

>  L'URL du backend est configurée dans `apps/biblio-app/src/app/core/config/config.ts`. Modifiez la si votre API est lancée sur un port ou un domaine différent.



## Packaging & Déploiement

1) Construisez l'app en prod :

```powershell
npm run build
```

2) Le résultat sera dans `dist/biblio-app`.

3) Déployez le dossier `dist/biblio-app` sur un serveur statique (Nginx, Netlify, Vercel, S3 + CloudFront, etc.) ou intégrez-le dans un conteneur.


## Ressources

- API : `API/README.md` (pour la configuration et la migration Prisma)
- Angular CLI Docs: https://angular.io/cli
- Tailwind + PostCSS est utilisé en DevDependencies — si vous travaillez sur les styles, vous trouverez `apps/biblio-app/src/styles.css`.

