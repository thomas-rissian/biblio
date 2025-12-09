# Projet API Prisma

Un projet API utilisant Prisma ORM (v7) avec PostgreSQL.
Migrer sous express.js ! 

## Installation

```bash
npm install
```

## Configuration

1. Créez un fichier `.env` basé sur `.env.example`:
```bash
cp .env.example .env
```

2. Mettez à jour les variables d'environnement avec vos identifiants PostgreSQL.

## Migrations

Créer une migration:
```bash
npx prisma migrate dev --name nom_de_la_migration
```

Appliquer les migrations:
```bash
npx prisma migrate deploy
```

## Utilisation

Générer Prisma Client:
```bash
npx prisma generate
```

Lancer un bdd de test:
```bash
npm run bdd
```

## Studio Prisma

Visualiser et modifier vos données:
```bash
npx prisma studio --config ./prisma.config.js
```

## Structure du projet

```
├── index.js               # Point d'entrée Express
├── config/
│   └── bddTest.js         # Scripts de démarrage / tests (ex: bddTest)
├── src/                   # Code applicatif
│   ├── controller/        # Controllers (authorController.js, bookController.js, ...)
│   ├── dao/               # Data Access Objects (authorDAO.js, ...) : accès bdd
│   ├── model/             # Modèles métier (Author.js, Book.js, Category.js, AppError.js, ...)
│   └── route/             # Routes / routers (authorRouter.js, ...)
├── lib/
│   └── prisma.js          # Instance Prisma Client
├── prisma/
│   ├── schema.prisma      # Modèles de données
│   └── migrations/        # Historique des migrations
├── test/                  # Tests unitaires et d'intégration
├── .env.example           # Template des variables d'environnement
├── .gitignore
├── package.json
├── prisma.config.js       # Configuration Prisma

``` 

## Test

Executer les test d'intégrations 
```bash
npm run test
```

## Documentation

- [Prisma ORM](https://www.prisma.io/docs/orm)
- [Prisma Postgres](https://www.prisma.io/docs/postgres)


