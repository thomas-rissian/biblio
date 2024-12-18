
class Author {
    #id = null;
    #name = null;
    #birthDate = null;
    #deathDate = null;
    #biography = null;
    #isUpdate = false;

    constructor(data) {
        this.#id = parseInt(data.id) || null; // L'ID est null pour la création
        this.#name = data.name;
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

    validate(isUpdate = true) {
        const errors = [];

        // Si c'est une mise à jour, vérifier que l'ID est valide
        if (isUpdate && (this.#id === null || isNaN(this.#id))) {
            errors.push("L'ID de l'auteur est invalide.");
        }

        // Vérification que le champ "name" est obligatoire
        if (!this.#name ||this.#name.length === 0) {
            errors.push("Le nom de l'auteur est obligatoire.");
        }

        return errors;
    }

    toJson(includeId = true) {
        const json = {
            name: this.#name,
            birthDate: this.#birthDate,
            deathDate: this.#deathDate,
            biography: this.#biography
        };

        if (includeId) {
            json.id = this.#id;
        }

        return json;
    }
}

module.exports = Author;
