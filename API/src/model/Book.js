/**
 * Représente un livre.
 */
class Book {
    #id = null;
    #title = null;
    #author = null;
    #publicationDate = null;
    #description = null;
    #categories = []; // Nouveau champ pour les catégories
    #error = [];
    /**
     * @param {{ id?: number, title: string, authorId: number, publicationDate?: Date, description?: string, categoryIds?: number[] }} data
     */
    constructor(data) {
        this.#id = parseInt(data.id) || null;
        this.#title = data.title || null;
        this.#author = parseInt(data.authorId) || null;
        this.#publicationDate = data.publicationDate ? new Date(data.publicationDate) : null;
        this.#description = data.description || '';
        this.#categories = Array.isArray(data.categoryIds) ? data.categoryIds.map(id => parseInt(id)) : [];
    }

    // Getters
    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    get author() {
        return this.#author;
    }

    get publicationDate() {
        return this.#publicationDate;
    }

    get description() {
        return this.#description;
    }

    get categories() {
        return this.#categories;
    }

    /**
     * @param {boolean} isUpdate - Indique si c'est une mise à jour
     * @returns {string[]} - Liste des erreurs
     */
    validate(isUpdate = true) {
       this.#error = [];

        if (isUpdate && (this.#id === null || isNaN(this.#id))) {
            this.#error.push({ id: "L'ID du livre est invalide." });
        }

        if (!this.#title || this.#title.trim().length === 0) {
            this.#error.push({ title: "Le titre du livre est obligatoire." });
        }
        if (!this.#author || isNaN(this.#author)) {
            this.#error.push({ author: "L'auteur du livre est obligatoire et doit être un identifiant valide." });
        }

        if (!this.#publicationDate || isNaN(this.#publicationDate.getTime())) {
            this.#error.push({ publicationDate: "La date de publication est obligatoire et doit être une date valide." });
        }

        if (!this.#description || this.#description.trim().length === 0) {
            this.#error.push({ description: "La description du livre est obligatoire." });
        }

        if (!Array.isArray(this.#categories) || this.#categories.length === 0) {
            this.#error.push({ categories: "Les catégories sont obligatoires et doivent contenir au moins une catégorie." });
        } else if (this.#categories.some(id => isNaN(id))) {
            this.#error.push({ categories: "Tous les identifiants des catégories doivent être valides." });
        }

        return this.#error;
    }

    /**
     * Convertit l'objet en JSON.
     * @param {boolean} [includeId=true] - Inclure l'ID dans la sortie
     * @returns {{title: null, authorId: null, publicationDate: null, description: null, categoryIds: number[]}}
     */
    toJson(includeId = true) {
        const json = {
            title: this.#title,
            authorId: this.#author, // L'ID de l'auteur
            publicationDate: this.#publicationDate,
            description: this.#description,
            categories: this.#categories, // Inclure les catégories
        };

        if (includeId) {
            json.id = this.#id;
        }

        return json;
    }
}

module.exports = Book;
