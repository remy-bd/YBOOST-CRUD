import { db } from '../database/database.js';
import { CreateGameInput, Game } from '../models/game.model.js';

interface GameRow {
    id: number;
    title: string;
    editor: string;
    release_year: number;
    genre: string;
    rating: number;
}

function mapRowToGame(row: GameRow): Game {
    return new Game(
        row.id,
        row.title,
        row.editor,
        row.release_year,
        row.genre,
        row.rating
    );
}

const findAllStmt = db.prepare<[], GameRow>(
    'SELECT id, title, editor, release_year, genre, rating FROM games ORDER BY id ASC'
);

const findByIdStmt = db.prepare<[number], GameRow>(
    'SELECT id, title, editor, release_year, genre, rating FROM games WHERE id = ?'
);

const insertStmt = db.prepare<CreateGameInput>(
    'INSERT INTO games (title, editor, release_year, genre, rating) VALUES (@title, @editor, @releaseYear, @genre, @rating)'
);

const updateStmt = db.prepare<CreateGameInput & { id: number }>(
    'UPDATE games SET title = @title, editor = @editor, release_year = @releaseYear, genre = @genre, rating = @rating WHERE id = @id'
);

const deleteStmt = db.prepare<[number]>(
    'DELETE FROM games WHERE id = ?'
);

export const gameRepository = {
    findAll(): Game[] {
        return findAllStmt.all().map(mapRowToGame);
    },

    findById(id: number): Game | undefined {
        const row = findByIdStmt.get(id);
        return row ? mapRowToGame(row) : undefined;
    },

    create(input: CreateGameInput): Game {
        const result = insertStmt.run(input);
        const created = findByIdStmt.get(Number(result.lastInsertRowid));
        if (!created) {
            throw new Error('Impossible de récupérer le jeu créé');
        }
        return mapRowToGame(created);
    },

    update(id: number, input: CreateGameInput): Game | undefined {
        const result = updateStmt.run({ ...input, id });
        if (result.changes === 0) {
            return undefined;
        }
        const updated = findByIdStmt.get(id);
        return updated ? mapRowToGame(updated) : undefined;
    },

    delete(id: number): boolean {
        const result = deleteStmt.run(id);
        return result.changes > 0;
    },
};
