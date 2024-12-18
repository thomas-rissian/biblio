# Biblio API

L'API **Biblio** permet d'effectuer des opérations CRUD sur la base de données.  
Elle n'utilise aucun framework (bien qu'Express, par exemple, aurait simplifié le développement), conformément aux exigences du cahier des charges (CDC).  
L'ORM **Prisma** est utilisé pour gérer la base de données, offrant flexibilité et facilité d'évolution.

L'API est hébergée sur un serveur distinct pour garantir une indépendance complète vis-à-vis du serveur web qui l'exploitera. Cette architecture améliore également la sécurité, en isolant la base de données du frontend.

---

## Configuration du projet

1. Installation des dépendances :
   ```sh
   npm install
   ```

2. Démarrage du serveur :
   ```sh
   npm start
   ```

   L'API sera accessible par défaut à l'adresse suivante :  
   [http://localhost:40000](http://localhost:40000)

---

## Base de données

1. Créez un fichier `.env` à la racine du projet avec le contenu suivant :
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
   ```

2. Par défaut, Prisma est configuré pour utiliser **PostgreSQL**. Si vous souhaitez utiliser un autre SGBD, modifiez le fichier `prisma/schema.prisma` :
   ```prisma
   provider = "postgresql"
   ```

3. Appliquez les migrations de la base de données :
   ```sh
   npx prisma migrate dev --name init
   ```

4. Générez les fichiers Prisma nécessaires :
   ```sh
   npx prisma generate
   ```

5. (Facultatif) Ajoutez des données de test à la base de données :
   ```sh
   npm run bdd
   ```

---

## Routes disponibles

### Livres
- `GET`    : `/books` - Récupère tous les livres
- `POST`   : `/books` - Crée un livre
- `GET`    : `/books/:id` - Récupère un livre spécifique
- `PUT`    : `/books/:id` - Modifie un livre
- `DELETE` : `/books/:id` - Supprime un livre
- `GET`    : `/books/author/:id` - Récupère les livres d'un auteur
- `DELETE` : `/books/author/:id` - Supprime les livres d'un auteur
- `GET`    : `/books/categories/:id` - Récupère les livres d'une catégorie
- `DELETE` : `/books/categories/:id` - Supprime les livres d'une catégorie

### Catégories
- `GET`    : `/categories` - Récupère toutes les catégories
- `GET`    : `/categories/:id` - Récupère une catégorie spécifique
- `POST`   : `/categories` - Crée une catégorie
- `PUT`    : `/categories/:id` - Modifie une catégorie
- `DELETE` : `/categories/:id` - Supprime une catégorie et ses livres si nécessaire

### Auteurs
- `GET`    : `/authors` - Récupère tous les auteurs
- `GET`    : `/authors/:id` - Récupère un auteur spécifique
- `POST`   : `/authors` - Crée un auteur
- `PUT`    : `/authors/:id` - Modifie un auteur
- `DELETE` : `/authors/:id` - Supprime un auteur et ses livres associés

---

## Remarques supplémentaires

- Respectez le format des données attendu par l'API lors des requêtes `POST` et `PUT`.
- Toute erreur ou exception renvoyée par l'API suit un format JSON standardisé, avec un message explicatif.
- Pour des performances optimales, Prisma est configuré pour utiliser des transactions sécurisées.

---

### Exemple de fichier `.env`
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase?schema=public"
