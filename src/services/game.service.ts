import { CreateGameInput, Game } from '../models/game.model.js';
import { gameRepository } from '../repositories/game.repository.js';

export class HttpError extends Error {
    status: number;
    details?: string[];

    constructor(status: number, message: string, details?: string[]) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.details = details;
    }
}

function parsePositiveIntId(rawId: string): number {
    if (!/^\d+$/.test(rawId)) {
        throw new HttpError(400, "L'identifiant doit être un entier strictement positif");
    }
    const id = Number(rawId);
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new HttpError(400, "L'identifiant doit être un entier strictement positif");
    }
    return id;
}

function validateGameInput(body: unknown): CreateGameInput {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        throw new HttpError(400, 'Données invalides', ['Le corps de la requête doit être un objet JSON']);
    }

    const data = body as Record<string, unknown>;
    const details: string[] = [];

    if (typeof data.title !== 'string' || data.title.trim().length === 0) {
        details.push('Le titre est obligatoire');
    }

    if (typeof data.editor !== 'string' || data.editor.trim().length === 0) {
        details.push("L'éditeur est obligatoire");
    }

    if (
        typeof data.releaseYear !== 'number' ||
        !Number.isInteger(data.releaseYear) ||
        data.releaseYear < 1950 ||
        data.releaseYear > 2100
    ) {
        details.push("L'année de sortie doit être un entier compris entre 1950 et 2100");
    }

    if (typeof data.genre !== 'string' || data.genre.trim().length === 0) {
        details.push('Le genre est obligatoire');
    }

    if (
        typeof data.rating !== 'number' ||
        !Number.isFinite(data.rating) ||
        data.rating < 0 ||
        data.rating > 10
    ) {
        details.push('La note doit être comprise entre 0 et 10');
    }

    if (details.length > 0) {
        throw new HttpError(400, 'Données invalides', details);
    }

    return {
        title: (data.title as string).trim(),
        editor: (data.editor as string).trim(),
        releaseYear: data.releaseYear as number,
        genre: (data.genre as string).trim(),
        rating: data.rating as number,
    };
}

export const gameService = {
    getAll(): Game[] {
        return gameRepository.findAll();
    },

    getById(rawId: string): Game {
        const id = parsePositiveIntId(rawId);
        const game = gameRepository.findById(id);
        if (!game) {
            throw new HttpError(404, 'Jeu introuvable');
        }
        return game;
    },

    create(body: unknown): Game {
        const input = validateGameInput(body);
        return gameRepository.create(input);
    },

    update(rawId: string, body: unknown): Game {
        const id = parsePositiveIntId(rawId);
        const existing = gameRepository.findById(id);
        if (!existing) {
            throw new HttpError(404, 'Jeu introuvable');
        }
        const input = validateGameInput(body);
        const updated = gameRepository.update(id, input);
        if (!updated) {
            throw new HttpError(404, 'Jeu introuvable');
        }
        return updated;
    },

    remove(rawId: string): void {
        const id = parsePositiveIntId(rawId);
        const deleted = gameRepository.delete(id);
        if (!deleted) {
            throw new HttpError(404, 'Jeu introuvable');
        }
    },
};
