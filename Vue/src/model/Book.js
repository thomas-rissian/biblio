/**
 * Représente un livre.
 */
export class Book {
    #id = null;
    #title = null;
    #authorId = null;
    #publicationDate = null;
    #description = null;
    #categories = [];
    #error = [];


    /**
     * @param {{ id?: number, title: string, authorId: number, publicationDate?: Date, description?: string, categoryIds?: number[] }} data
     */
    constructor(data) {
        this.#id = parseInt(data.id) || null;
        this.#title = data.title || null;
        this.#authorId = parseInt(data.authorId) || null;
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

    get authorId() {
        return this.#authorId;
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
    get error() {
        return this.#error;
    }

    /**
     * @param {boolean} isUpdate - Indique si c'est une mise à jour
     * @returns {string[]} - Liste des erreurs
     */
    validate(isUpdate) {
        this.#error = []; // Réinitialiser les erreurs avant la validation

        if (isUpdate && (this.#id === null || isNaN(this.#id))) {
            this.#error.push({ id: "L'ID du livre est invalide." });
        }

        if (!this.#title || this.#title.trim().length === 0) {
            this.#error.push({ title: "Le titre du livre est obligatoire." });
        }
        if (!this.#authorId || isNaN(this.#authorId)) {
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

}
