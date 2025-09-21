import { getPool } from "../db/dbUtils.js";

async function createTables(req, res) {
  try {
    const client = await getPool().connect();

    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            user_name VARCHAR(100) NOT NULL,
            registration_number INTEGER NOT NULL UNIQUE,
            email_id VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(300) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        `;
    await client.query(createUsersTableQuery);

    const createTokensTableQuery = `CREATE TABLE IF NOT EXISTS refresh_tokens
        (
            token VARCHAR(255) NOT NULL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at TIMESTAMP WITHOUT TIME ZONE,
            is_valid BOOLEAN,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id)
                REFERENCES public.users (user_id)
                ON UPDATE NO ACTION
                ON DELETE CASCADE
        );
        `;
    await client.query(createTokensTableQuery);

    const createBookStatusEnumQuery = `CREATE TYPE book_availability_status AS ENUM (
            'Available',
            'Lent',
            'Lost'
        );
        `;
    await client.query(createBookStatusEnumQuery);

    const createExchangeStatusEnumQuery = `CREATE TYPE exchange_status AS ENUM (
            'Pending',
            'Accepted',
            'Rejected',
            'Returned',
            'Overdue'
        );
        `;
    await client.query(createExchangeStatusEnumQuery);

    const createBooksTableQuery = `CREATE TABLE IF NOT EXISTS books (
            book_id SERIAL PRIMARY KEY,
            book_name VARCHAR(255) NOT NULL,
            author_name VARCHAR(255) NOT NULL,
            publication_year INTEGER CHECK (publication_year > 0),
            isbn VARCHAR(20) UNIQUE,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
         );
        `;
    await client.query(createBooksTableQuery);

    const createBookGenresTableQuery = `CREATE TABLE IF NOT EXISTS book_genres (
            book_id INTEGER REFERENCES books(book_id),
            genre VARCHAR(100),
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
         );
        `;
    await client.query(createBookGenresTableQuery);

    const createBooksUsersTableQuery = `CREATE TABLE IF NOT EXISTS books_users (
            id SERIAL PRIMARY KEY,
            book_id INTEGER NOT NULL,
            owner_id INTEGER NOT NULL,
            availability_status book_availability_status NOT NULL DEFAULT 'Available',
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT books_users_owner_id_fkey FOREIGN KEY (owner_id)
                 REFERENCES public.users (user_id)
                 ON UPDATE NO ACTION
                 ON DELETE CASCADE,
             CONSTRAINT books_users_book_id_fkey FOREIGN KEY (book_id)
                 REFERENCES public.books (book_id)
                 ON UPDATE NO ACTION
                 ON DELETE CASCADE
         );`;
    await client.query(createBooksUsersTableQuery);

    const createExchangesTableQuery = `CREATE TABLE IF NOT EXISTS books_exchanged (
            exchange_id SERIAL PRIMARY KEY,
            borrower_id INTEGER NOT NULL,
            lender_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            request_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            borrow_date TIMESTAMP WITH TIME ZONE,
            returned_date TIMESTAMP WITH TIME ZONE CHECK (borrow_date > request_date),
            due_date TIMESTAMP WITH TIME ZONE,
            status exchange_status NOT NULL DEFAULT 'Pending',
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT books_exchanged_borrower_id_fkey FOREIGN KEY (borrower_id) 
         REFERENCES public.users (user_id) 
         ON UPDATE NO ACTION 
         ON DELETE CASCADE, 
             CONSTRAINT books_exchanged_lender_id_fkey FOREIGN KEY (lender_id) 
         REFERENCES public.users (user_id) 
         ON UPDATE NO ACTION 
         ON DELETE CASCADE, 
             CONSTRAINT books_exchanged_book_id_fkey FOREIGN KEY (book_id) 
         REFERENCES public.books (book_id) 
         ON UPDATE NO ACTION 
         ON DELETE CASCADE
         );
        `;
    await client.query(createExchangesTableQuery);

    const createBookNameIndexQuery = `CREATE INDEX idx_books_book_name ON books (book_name);
        `;
    await client.query(createBookNameIndexQuery);

    const createAuthorNameIndexQuery = `CREATE INDEX idx_books_author_name ON books (author_name);
        `;
    await client.query(createAuthorNameIndexQuery);

    const createBookGenresIndexQuery = `CREATE INDEX idx_books_genres ON book_genres (genre);
        `;
    await client.query(createBookGenresIndexQuery);

    client.release();
    console.log("Tables created successfully!");
    res.status(201).json({ message: "Tables created successfully!" });
  } catch (err) {
    console.error("Error creating tables:", err);
    res.status(500).json({ error: "Failed to create tables." });
  }
}

export { createTables };
