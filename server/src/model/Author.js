/**
 * Représente un Auteur.
 */
export class Author {
    #id = null;
    #name = null;
    #birthDate = null;
    #deathDate = null;
    #biography = null;

    /**
     * Constructeur de la classe Author.
     * @param {{ id?: number, name: string, birthDate?: string, deathDate?: string, biography?: string }} data
     */
    constructor(data = {}) {
        this.#id = parseInt(data.id) || null;
        this.#name = data.name || '';
        this.#birthDate = data.birthDate ? new Date(data.birthDate) : null;
        this.#deathDate = data.deathDate ? new Date(data.deathDate) : null;
        this.#biography = data.biography || '';
    }

    // Getters
    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get birthDate() {
        return this.#birthDate;
    }

    get deathDate() {
        return this.#deathDate;
    }

    get biography() {
        return this.#biography;
    }

    // Setters (utilisés pour mettre à jour les champs)
    set name(value) {
        this.#name = value;
    }

    set birthDate(value) {
        this.#birthDate = value ? new Date(value) : null;
    }

    set deathDate(value) {
        this.#deathDate = value ? new Date(value) : null;
    }

    set biography(value) {
        this.#biography = value;
    }

    /**
     * Valide les données de l'auteur.
     * @param {boolean} isUpdate - Indique s'il s'agit d'une mise à jour.
     * @returns {Array.<{ [field: string]: string }>} Liste des erreurs par champ.
     */
    validate(isUpdate = false) {
        const errors = [];

        // Si c'est une mise à jour, vérifier que l'ID est valide
        if (isUpdate && (this.#id === null || isNaN(this.#id))) {
            errors.push({ id: "L'ID de l'auteur est invalide." });
        }

        // Vérification du champ "name"
        if (!this.#name || this.#name.trim().length === 0) {
            errors.push({ name: "Le nom de l'auteur est obligatoire." });
        }
        // Vérification du champ "name"
        if (!this.#biography || this.#biography.trim().length === 0) {
            errors.push({ biography: "Le nom de l'auteur est obligatoire." });
        }
        // Vérification de la cohérence des dates
        if (this.#birthDate && isNaN(this.#birthDate.getTime()) || !this.#birthDate) {
            errors.push({ birthDate: "La date de naissance est invalide." });
        }


        if (this.#birthDate && this.#deathDate && this.#deathDate < this.#birthDate) {
            errors.push({ deathDate: "La date de décès ne peut pas être antérieure à la date de naissance." });
        }

        return errors;
    }
}

