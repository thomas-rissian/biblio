const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Truncate les tables pour vider les données existantes
    await prisma.book.deleteMany();          // Supprimer les livres
    await prisma.category.deleteMany();      // Supprimer les catégories
    await prisma.author.deleteMany();        // Supprimer les auteurs

    // Création de catégories avec des IDs fixes
    const fictionCategory = await prisma.category.create({
        data: {
            id: 1,  // ID fixe
            name: 'Fiction',
        },
    });

    const nonFictionCategory = await prisma.category.create({
        data: {
            id: 2,  // ID fixe
            name: 'Non-Fiction',
        },
    });

    const fantasyCategory = await prisma.category.create({
        data: {
            id: 3,  // ID fixe
            name: 'Fantasy',
        },
    });

    // Création d'auteurs avec des IDs fixes
    const author1 = await prisma.author.create({
        data: {
            id: 1,  // ID fixe
            name: 'J.K. Rowling',
            birthDate: new Date('1965-07-31'),
            biography: 'J.K. Rowling is the author of the Harry Potter series.',
        },
    });

    const author2 = await prisma.author.create({
        data: {
            id: 2,  // ID fixe
            name: 'George Orwell',
            birthDate: new Date('1903-06-25'),
            deathDate: new Date('1950-01-21'),
            biography: 'George Orwell was an English novelist and essayist.',
        },
    });

    const author3 = await prisma.author.create({
        data: {
            id: 3,  // ID fixe
            name: 'Isaac Asimov',
            birthDate: new Date('1920-01-02'),
            biography: 'Isaac Asimov was an American writer and professor of biochemistry.',
        },
    });

    // Création de livres avec des relations vers les auteurs et catégories
    const book1 = await prisma.book.create({
        data: {
            id: 1,  // ID fixe
            title: 'Harry Potter and the Sorcerer\'s Stone',
            description: 'The first book in the Harry Potter series, where Harry discovers he is a wizard.',
            publicationDate: new Date('1997-06-26'),
            authorId: author1.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: fantasyCategory.id }],
            },
        },
    });

    const book2 = await prisma.book.create({
        data: {
            id: 2,  // ID fixe
            title: '1984',
            description: 'A dystopian novel by George Orwell about a totalitarian regime.',
            publicationDate: new Date('1949-06-08'),
            authorId: author2.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: nonFictionCategory.id }],
            },
        },
    });

    const book3 = await prisma.book.create({
        data: {
            id: 3,  // ID fixe
            title: 'Brave New World',
            description: 'A novel by Aldous Huxley that explores a dystopian future.',
            publicationDate: new Date('1932-08-31'),
            authorId: author2.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: nonFictionCategory.id }],
            },
        },
    });

    const book4 = await prisma.book.create({
        data: {
            id: 4,  // ID fixe
            title: 'Foundation',
            description: 'A science fiction novel by Isaac Asimov that focuses on the collapse of a galactic empire.',
            publicationDate: new Date('1951-06-01'),
            authorId: author3.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: fantasyCategory.id }],
            },
        },
    });

    const book5 = await prisma.book.create({
        data: {
            id: 5,  // ID fixe
            title: 'I, Robot',
            description: 'A collection of science fiction short stories by Isaac Asimov about robots and their ethics.',
            publicationDate: new Date('1950-12-02'),
            authorId: author3.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: nonFictionCategory.id }],
            },
        },
    });

    console.log('Données de test insérées avec succès!');
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
