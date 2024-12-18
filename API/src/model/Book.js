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
    validate(isUpdate) {
        const errors = [];

        if (isUpdate && (this.#id === null || isNaN(this.#id))) {
            errors.push("L'ID du livre est invalide.");
        }

        if (!this.#title || this.#title.length === 0) {
            errors.push("Le titre du livre est obligatoire.");
        }

        if (!this.#author) {
            errors.push("L'auteur du livre est obligatoire.");
        }

        // Vérifier que les catégories sont des identifiants valides
        if (!Array.isArray(this.#categories) || this.#categories.length === 0 ) {
            errors.push("Les catégories sont obligatoires.");
        } else if (this.#categories.some(id => isNaN(id))) {
            errors.push("Certains identifiants de catégorie sont invalides.");
        }

        return errors;
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
