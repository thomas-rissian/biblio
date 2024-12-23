const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');


async function main() {

    await prisma.$connect();

    // Supprimer les données existantes pour éviter les conflits
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();


    // Création des catégories avec des IDs fixes
    const categories = await prisma.category.createMany({
        data: [
            { id: 1, name: 'Fantasy' },
            { id: 2, name: 'Dystopian' },
            { id: 3, name: 'Romance' },
            { id: 4, name: 'Classic Literature' },
        ],
    });

    // Création des auteurs avec des IDs fixes
    const authors = await prisma.author.createMany({
        data: [
            { id: 1, name: 'J.K. Rowling', birthDate: new Date('1965-07-31'), biography: 'British author, best known for the Harry Potter series.' },
            { id: 2, name: 'George Orwell', birthDate: new Date('1903-06-25'), deathDate: new Date('1950-01-21'), biography: 'English novelist and essayist, known for "1984" and "Animal Farm".' },
            { id: 3, name: 'Jane Austen', birthDate: new Date('1775-12-16'), deathDate: new Date('1817-07-18'), biography: 'English novelist known for "Pride and Prejudice".' },
        ],
    });

    // Création des livres avec des IDs fixes
    await prisma.book.createMany({
        data: [
            {
                id: 1,
                title: "Harry Potter and the Philosopher's Stone",
                description: 'A young wizard embarks on his journey.',
                publicationDate: new Date('1997-06-26'),
                authorId: 1,
            },
            {
                id: 2,
                title: '1984',
                description: 'A dystopian novel set in a totalitarian society.',
                publicationDate: new Date('1949-06-08'),
                authorId: 2,
            },
            {
                id: 3,
                title: 'Pride and Prejudice',
                description: 'A classic romance novel.',
                publicationDate: new Date('1813-01-28'),
                authorId: 3,
            },
            {
                id: 4,
                title: 'Animal Farm',
                description: 'A satirical novella about farm animals overthrowing their owner.',
                publicationDate: new Date('1945-08-17'),
                authorId: 2,
            },
        ],
    });

    // Ajout des relations entre livres et catégories après création
    const category1 = await prisma.category.findUnique({ where: { id: 1 } });
    const category2 = await prisma.category.findUnique({ where: { id: 2 } });
    const category3 = await prisma.category.findUnique({ where: { id: 3 } });
    const category4 = await prisma.category.findUnique({ where: { id: 4 } });

    // Vérifie si les catégories existent avant de les connecter
    if (category1 && category2 && category3 && category4) {
        await prisma.book.update({
            where: { id: 1 },
            data: { categories: { connect: [{ id: 1 }] } },
        });

        await prisma.book.update({
            where: { id: 2 },
            data: { categories: { connect: [{ id: 2 }, { id: 4 }] } },
        });

        await prisma.book.update({
            where: { id: 3 },
            data: { categories: { connect: [{ id: 3 }] } },
        });

        await prisma.book.update({
            where: { id: 4 },
            data: { categories: { connect: [{ id: 4 }] } },
        });
    } else {
        console.log("Une ou plusieurs catégories manquent");
    }

    console.log('Database has been seeded successfully!');
};

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

module.exports = {
    main,
};
