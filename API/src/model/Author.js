
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

        if (isUpdate && (this.#id === null || isNaN(this.#id))) {
            errors.push({ id: "L'ID de l'auteur est invalide." });
        }

        if (!this.#name || this.#name.trim().length === 0) {
            errors.push({ name: "Le nom de l'auteur est obligatoire." });
        }
        if (!this.#biography || this.#biography.trim().length === 0) {
            errors.push({ biography: "La biographie de l'auteur est obligatoire." });
        }
        if (this.#birthDate && isNaN(this.#birthDate.getTime()) || !this.#birthDate) {
            errors.push({ birthDate: "La date de naissance est invalide." });
        }

        if (this.#birthDate && this.#deathDate && this.#deathDate < this.#birthDate) {
            errors.push({ deathDate: "La date de décès ne peut pas être antérieure à la date de naissance." });
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
