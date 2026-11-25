import Database from 'better-sqlite3';
import path from 'node:path';
import { projectRoot } from '../config/paths.js';

const dbPath = path.join(projectRoot, 'src/database/game.db');

export const db: Database.Database = new Database(dbPath);
