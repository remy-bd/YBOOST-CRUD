export interface CreateGameInput {
    title: string;
    editor: string;
    releaseYear: number;
    genre: string;
    rating: number;
}

export class Game {
    id: number;
    title: string;
    editor: string;
    releaseYear: number;
    genre: string;
    rating: number;

    constructor(
        id: number,
        title: string,
        editor: string,
        releaseYear: number,
        genre: string,
        rating: number
    ) {
        this.id = id;
        this.title = title;
        this.editor = editor;
        this.releaseYear = releaseYear;
        this.genre = genre;
        this.rating = rating;
    }
}
