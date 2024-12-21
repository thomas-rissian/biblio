const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Truncate les tables pour vider les données existantes
    await prisma.book.deleteMany();          // Supprimer les livres
    await prisma.category.deleteMany();      // Supprimer les catégories
    await prisma.author.deleteMany();        // Supprimer les auteurs

    // Création de catégories
    const fictionCategory = await prisma.category.create({
        data: {
            name: 'Fiction',
        },
    });

    const nonFictionCategory = await prisma.category.create({
        data: {
            name: 'Non-Fiction',
        },
    });

    const fantasyCategory = await prisma.category.create({
        data: {
            name: 'Fantasy',
        },
    });

    // Création d'auteurs
    const author1 = await prisma.author.create({
        data: {
            name: 'J.K. Rowling',
            birthDate: new Date('1965-07-31'),
            biography: 'J.K. Rowling is the author of the Harry Potter series.',
        },
    });

    const author2 = await prisma.author.create({
        data: {
            name: 'George Orwell',
            birthDate: new Date('1903-06-25'),
            deathDate: new Date('1950-01-21'),
            biography: 'George Orwell was an English novelist and essayist.',
        },
    });

    const author3 = await prisma.author.create({
        data: {
            name: 'Isaac Asimov',
            birthDate: new Date('1920-01-02'),
            biography: 'Isaac Asimov was an American writer and professor of biochemistry.',
        },
    });

    // Création de livres avec des relations vers les auteurs et catégories
    const book1 = await prisma.book.create({
        data: {
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
            title: 'I, Robot',
            description: 'A collection of science fiction short stories by Isaac Asimov about robots and their ethics.',
            publicationDate: new Date('1950-12-02'),
            authorId: author3.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: nonFictionCategory.id }],
            },
        },
    });

    const book6 = await prisma.book.create({
        data: {
            title: 'The Hobbit',
            description: 'A fantasy novel by J.R.R. Tolkien about Bilbo Baggins’ adventure to reclaim treasure.',
            publicationDate: new Date('1937-09-21'),
            authorId: author1.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: fantasyCategory.id }],
            },
        },
    });

    const book7 = await prisma.book.create({
        data: {
            title: 'The Road',
            description: 'A post-apocalyptic novel by Cormac McCarthy about a father and son’s survival journey.',
            publicationDate: new Date('2006-09-26'),
            authorId: author2.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: nonFictionCategory.id }],
            },
        },
    });

    const book8 = await prisma.book.create({
        data: {
            title: 'The Man in the High Castle',
            description: 'A novel by Philip K. Dick that imagines a world where the Axis powers won WWII.',
            publicationDate: new Date('1962-11-17'),
            authorId: author3.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: fantasyCategory.id }],
            },
        },
    });

    const book9 = await prisma.book.create({
        data: {
            title: 'The Left Hand of Darkness',
            description: 'A science fiction novel by Ursula K. Le Guin set on a planet where inhabitants can change sex.',
            publicationDate: new Date('1969-03-01'),
            authorId: author3.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: fantasyCategory.id }],
            },
        },
    });

    const book10 = await prisma.book.create({
        data: {
            title: 'The Dispossessed',
            description: 'A novel by Ursula K. Le Guin about an anarchist society and its struggle for survival.',
            publicationDate: new Date('1974-03-01'),
            authorId: author3.id,
            categories: {
                connect: [{ id: fictionCategory.id }, { id: fantasyCategory.id }],
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
