export class Category {
    #id = null;
    #name = null;

    constructor(data) {
        this.#id = parseInt(data.id) || null;
        this.#name = data.name?.trim() || null;
    }

    // Getters
    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    /**
     * Valide les données de la catégorie.
     * @param {boolean} isUpdate - Indique si c'est une mise à jour.
     * @returns {Object[]} - Liste des erreurs sous forme d'objets { champ: "message d'erreur" }.
     */
    validate(isUpdate = true) {
        const errors = [];

        // Validation de l'ID pour une mise à jour
        if (isUpdate && (this.#id === null || isNaN(this.#id))) {
            errors.push({ id: "L'ID de la catégorie est invalide." });
        }

        // Validation du champ "name"
        if (!this.#name || this.#name.length === 0) {
            errors.push({ name: "Le nom de la catégorie est obligatoire." });
        }

        return errors;
    }

}

