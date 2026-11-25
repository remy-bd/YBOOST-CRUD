import { Router } from 'express';
import { gameController } from '../controllers/game.controller.js';

export const gameRoutes = Router();

gameRoutes.get('/', gameController.getAll);
gameRoutes.get('/:id', gameController.getById);
gameRoutes.post('/', gameController.create);
gameRoutes.put('/:id', gameController.update);
gameRoutes.delete('/:id', gameController.remove);
