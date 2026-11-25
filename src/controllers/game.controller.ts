import type { Request, Response } from 'express';
import { gameService } from '../services/game.service.js';

export const gameController = {
    getAll(_req: Request, res: Response): void {
        const games = gameService.getAll();
        res.status(200).json(games);
    },

    getById(req: Request, res: Response): void {
        const game = gameService.getById(String(req.params.id ?? ''));
        res.status(200).json(game);
    },

    create(req: Request, res: Response): void {
        const created = gameService.create(req.body);
        res.status(201).json(created);
    },

    update(req: Request, res: Response): void {
        const updated = gameService.update(String(req.params.id ?? ''), req.body);
        res.status(200).json(updated);
    },

    remove(req: Request, res: Response): void {
        gameService.remove(String(req.params.id ?? ''));
        res.status(204).send();
    },
};
