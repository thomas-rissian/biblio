const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Truncate les tables pour vider les données existantes
    await prisma.bookCategory.deleteMany();  // Supprimer les entrées dans la table de relation BookCategory
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
