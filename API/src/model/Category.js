class Category {
    #id = null;
    #name = null;

    constructor(data) {
        this.#id = parseInt(data.id) || null;
        this.#name = data.name;
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
            errors.push("L'ID de la catégorie est invalide.");
        }

        if (!this.#name) {
            errors.push("Le nom de la catégorie est obligatoire.");
        }

        return errors;
    }
    toJson(includeId = false) {
        const json = {
            name: this.#name,
        };

        if (includeId) {
            json.id = this.#id;
        }

        return json;
    }
}

export default Category;