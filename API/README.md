# Projet API Prisma

Un projet API utilisant Prisma ORM avec PostgreSQL.

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

Lancer un script de test:
```bash
node script.js
```

## Studio Prisma

Visualiser et modifier vos données:
```bash
npx prisma studio --config ./prisma.config.js
```

## Structure du projet

```
├── lib/
│   └── prisma.js          # Instance Prisma Client
├── prisma/
│   ├── schema.prisma      # Modèles de données
│   └── migrations/        # Historique des migrations
├── .env.example           # Template des variables d'environnement
├── .gitignore
├── package.json
├── prisma.config.js       # Configuration Prisma
└── script.js              # Script de test
```

## Documentation

- [Prisma ORM](https://www.prisma.io/docs/orm)
- [Prisma Postgres](https://www.prisma.io/docs/postgres)
