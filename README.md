# Biblio

## Présentation

Bienvenue sur **Biblio**, une plateforme dédiée à la gestion et à la consultation de livres.  
Ce projet repose sur une architecture composée de deux serveurs distincts :

- **API Biblio** : Un serveur backend permettant d'effectuer des opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) sur une base de données. Il gère les livres, auteurs et catégories de manière efficace et flexible.

[FRONTEND]
- **Vue** : Un frontend moderne construit avec le framework Vue.js, qui exploite l'API Biblio
- **Angular** : Un frontend moderne construit avec le framework Angular, qui exploite l'API Biblio

Cette séparation des responsabilités entre l'API et le serveur web garantit une architecture modulaire, facilitant l'évolutivité et l'intégration avec d'autres systèmes.

---
## Setup necessaire 

- node.js >= 18
- Bdd Postgresql

## Configuration

### Ports par défaut

- **API Biblio** : Accessible sur le **port 3000**.
- **Serveur Vue** : Accessible sur le **port 5173**.
- **Serveur Angular** : Accessible sur le **port 4200**.

Le port de l'API peut-être modifier dans le fichier index.js

### Guides de configuration

Chaque serveur dispose de son propre fichier `README` situé dans son dossier racine. Ces guides détaillent les étapes nécessaires pour :
- Installer les dépendances,
- Configurer l'environnement,
- Démarrer

Mais un guide d'installation et d'utilisation est disponible dans /doc.

---

## 🐳 Docker - Démarrage rapide

### 1. Préparer les secrets
```bash
mkdir secrets
echo "biblio_password_123" > secrets/.db_password
```

### 2. Copier la config
```bash
cp .env.example .env
```

### 3. Démarrer
```powershell
# Windows
.\docker-start.ps1 start

# Linux/macOS
chmod +x docker-start.sh && ./docker-start.sh start
```

### 4. Accéder
- **Frontend Angular**: http://localhost:4200
- **Frontend Vue**: http://localhost:5173
- **API**: http://localhost:3001/api/v1
- **DB PostgreSQL**: localhost:5432

**Secret BDD**: `secrets/.db_password` = `biblio_password_123`
(réutiliser coté API)