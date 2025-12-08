import { prisma } from '../lib/prisma.js'
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';


async function main() {

    await prisma.$connect();

    // Clear DB tables and reset sequences
    try {
        // Log tables (debug)
        try {
            const tables = await prisma.$queryRawUnsafe("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'");
            console.log('[bddTest] Tables in DB:', tables.map(t => t.tablename));
        } catch (e) {
            console.warn('[bddTest] Could not list tables:', e.message);
        }

            // Retry TRUNCATE a few times in case of transient deadlocks
            const maxRetries = 3;
            let truncated = false;
            for (let attempt = 1; attempt <= maxRetries && !truncated; attempt++) {
                try {
                    await prisma.$executeRawUnsafe('TRUNCATE TABLE "_BookCategories", "Book", "Author", "Category" RESTART IDENTITY CASCADE');
                    console.log('[bddTest] Tables truncated (RESTART IDENTITY CASCADE)');
                    truncated = true;
                } catch (e) {
                    console.warn(`[bddTest] TRUNCATE attempt ${attempt} failed: ${e.message}`);
                    if (attempt < maxRetries) {
                        // Delay before retry
                        await new Promise((r) => setTimeout(r, 200));
                    } else {
                        throw e;
                    }
                }
            }
        // Log counts after clearing
        const bCountAfterTruncate = await prisma.book.count();
        const aCountAfterTruncate = await prisma.author.count();
        const cCountAfterTruncate = await prisma.category.count();
        console.log(`[bddTest] Counts after clear - books: ${bCountAfterTruncate}, authors: ${aCountAfterTruncate}, categories: ${cCountAfterTruncate}`);
    } catch (err) {
        console.error('[bddTest] Error clearing tables:', err.message);
    }


    // Seed data in a transaction
    try {
        await prisma.$transaction(async (tx) => {
            // Categories
            await tx.category.createMany({
                data: [
                    { name: 'Fantasy' },
                    { name: 'Dystopian' },
                    { name: 'Romance' },
                    { name: 'Classic Literature' },
                ],
                skipDuplicates: true,
            });

            // Authors
            const author1 = await tx.author.create({ data: { name: 'J.K. Rowling', birthDate: new Date('1965-07-31'), biography: 'British author, best known for the Harry Potter series.' } });
            const author2 = await tx.author.create({ data: { name: 'George Orwell', birthDate: new Date('1903-06-25'), deathDate: new Date('1950-01-21'), biography: 'English novelist and essayist, known for "1984" and "Animal Farm".' } });
            const author3 = await tx.author.create({ data: { name: 'Jane Austen', birthDate: new Date('1775-12-16'), deathDate: new Date('1817-07-18'), biography: 'English novelist known for "Pride and Prejudice".' } });

            // Books
            const book1 = await tx.book.create({ data: { title: "Harry Potter and the Philosopher's Stone", description: 'A young wizard embarks on his journey.', publicationDate: new Date('1997-06-26'), authorId: author1.id } });
            const book2 = await tx.book.create({ data: { title: '1984', description: 'A dystopian novel set in a totalitarian society.', publicationDate: new Date('1949-06-08'), authorId: author2.id } });
            const book3 = await tx.book.create({ data: { title: 'Pride and Prejudice', description: 'A classic romance novel.', publicationDate: new Date('1813-01-28'), authorId: author3.id } });
            const book4 = await tx.book.create({ data: { title: 'Animal Farm', description: 'A satirical novella about farm animals overthrowing their owner.', publicationDate: new Date('1945-08-17'), authorId: author2.id } });

            // Get created categories
            const catFantasy = await tx.category.findUnique({ where: { name: 'Fantasy' } });
            const catDystopian = await tx.category.findUnique({ where: { name: 'Dystopian' } });
            const catRomance = await tx.category.findUnique({ where: { name: 'Romance' } });
            const catClassic = await tx.category.findUnique({ where: { name: 'Classic Literature' } });

            if (!(catFantasy && catDystopian && catRomance && catClassic)) {
                throw new Error('Categories not found during seeding');
            }

            // Connect categories to books
            await tx.book.update({ where: { id: book1.id }, data: { categories: { connect: [{ id: catFantasy.id }] } } });
            await tx.book.update({ where: { id: book2.id }, data: { categories: { connect: [{ id: catDystopian.id }, { id: catClassic.id }] } } });
            await tx.book.update({ where: { id: book3.id }, data: { categories: { connect: [{ id: catRomance.id }] } } });
            await tx.book.update({ where: { id: book4.id }, data: { categories: { connect: [{ id: catClassic.id }] } } });
        });
    } catch (err) {
        console.error('[bddTest] Error while seeding (transaction rolled back):', err.message);
        // Re-throw so tests fail intentionally
        throw err;
    }

    // Relations handled above in transaction

    // Log counts after seeding and assert expected counts
    const bCountAfterSeed = await prisma.book.count();
    const aCountAfterSeed = await prisma.author.count();
    const cCountAfterSeed = await prisma.category.count();
    console.log(`[bddTest] Counts after seed - books: ${bCountAfterSeed}, authors: ${aCountAfterSeed}, categories: ${cCountAfterSeed}`);

    const expectedBooks = 4;
    const expectedAuthors = 3;
    const expectedCategories = 4;

    if (bCountAfterSeed !== expectedBooks || aCountAfterSeed !== expectedAuthors || cCountAfterSeed !== expectedCategories) {
        throw new Error(`[bddTest] Seed counts mismatch - got books:${bCountAfterSeed}, authors:${aCountAfterSeed}, categories:${cCountAfterSeed}`);
    }
};

// If run directly with node ./config/bddTest.js, execute main() and disconnect afterward
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
    main()
        .then(async () => {
            try {
                await prisma.$disconnect();
            } catch (e) {
                console.error('[bddTest] Error disconnecting prisma:', e.message);
            }
            console.log('[bddTest] CLI seed finished');
        })
        .catch(async (err) => {
            console.error('[bddTest] Seed failed via CLI:', err.message);
            try {
                await prisma.$disconnect();
            } catch (e) {
                console.error('[bddTest] Error disconnecting prisma after failure:', e.message);
            }
            process.exit(1);
        });
}

export { main };
