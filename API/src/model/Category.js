class Category {
    #id = null;
    #name = null;
    #isUpdate = false;

    constructor(data, isUpdate = false) {
        this.#id = parseInt(data.id) || null;
        this.#name = data.name;
        this.#isUpdate = isUpdate;
    }

    // Getters
    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    validate(isUpdate = true) {
        const errors = [];

        if (isUpdate && (this.#id === null || isNaN(this.#id))) {
            errors.push({ id: "L'ID de la catégorie est invalide." });
        }

        // Validation du champ "name"
        if (!this.#name || this.#name.length === 0) {
            errors.push({ name: "Le nom de la catégorie est obligatoire." });
        }

        return errors;
    }

    toJson(includeId = true) {
        const json = {
            name: this.#name
        };

        if (includeId) {
            json.id = this.#id;
        }

        return json;
    }
}

module.exports = Category;