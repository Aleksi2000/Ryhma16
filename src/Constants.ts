
import { io } from "socket.io-client";
export const VERTICAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const HORIZONTAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const GRID_SIZE = 100

export const socket = io("https://chessprojectbackend.herokuapp.com/");

export function samePosition(p1: Position, p2: Position) {
    return p1.x === p2.x && p1.y === p2.y
}

export interface Position {
    x: number
    y: number
}

export enum PieceType {
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING
}

export enum TeamType {
    OPPONENT,
    OUR
}

export interface Piece {
    image: string
    position: Position
    type: PieceType
    team: TeamType
    enPassant?: boolean
}

export const initialBoardState: Piece[] = [

    //WHITE PIECES

    {
        image: `assets/images/whiteRook.png`, position: {x: 0, y: 0}, type: PieceType.ROOK, team: TeamType.OUR,
    },
    {
        image: `assets/images/whiteRook.png`, position: {x: 7, y: 0}, type: PieceType.ROOK, team: TeamType.OUR,
    },
    {
        image: `assets/images/whiteKnight.png`, position: {x: 1, y: 0}, type: PieceType.KNIGHT, team: TeamType.OUR,
    },
    {
        image: `assets/images/whiteKnight.png`, position: {x: 6, y: 0}, type: PieceType.KNIGHT, team: TeamType.OUR,
    },
    {
        image: `assets/images/whiteBishop.png`, position: {x: 2, y: 0}, type: PieceType.BISHOP, team: TeamType.OUR,
    },
    {
        image: `assets/images/whiteBishop.png`, position: {x: 5, y: 0}, type: PieceType.BISHOP, team: TeamType.OUR,
    },
    {
        image: `assets/images/whiteQueen.png`, position: {x: 3, y: 0}, type: PieceType.QUEEN, team: TeamType.OUR,
    },
    {
        image: `assets/images/whiteKing.png`, position: {x: 4, y: 0}, type: PieceType.KING, team: TeamType.OUR,
    },
    {
        image: `assets/images/whitePawn.png`, position: {x: 0, y: 1}, type: PieceType.PAWN, team: TeamType.OUR,
    },
    {
        image: `assets/images/whitePawn.png`, position: {x: 1, y: 1}, type: PieceType.PAWN, team: TeamType.OUR,
    },
    {
        image: `assets/images/whitePawn.png`, position: {x: 2, y: 1}, type: PieceType.PAWN, team: TeamType.OUR,
    },
    {
        image: `assets/images/whitePawn.png`, position: {x: 3, y: 1}, type: PieceType.PAWN, team: TeamType.OUR,
    },
    {
        image: `assets/images/whitePawn.png`, position: {x: 4, y: 1}, type: PieceType.PAWN, team: TeamType.OUR,
    },
    {
        image: `assets/images/whitePawn.png`, position: {x: 5, y: 1}, type: PieceType.PAWN, team: TeamType.OUR,
    },
    {
        image: `assets/images/whitePawn.png`, position: {x: 6, y: 1}, type: PieceType.PAWN, team: TeamType.OUR,
    },
    {
        image: `assets/images/whitePawn.png`, position: {x: 7, y: 1}, type: PieceType.PAWN, team: TeamType.OUR,
    },

    //BLACK PIECES

    {
        image: `assets/images/blackRook.png`, position: {x: 0, y: 7}, type: PieceType.ROOK, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackRook.png`, position: {x: 7, y: 7}, type: PieceType.ROOK, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackKnight.png`, position: {x: 1, y: 7}, type: PieceType.KNIGHT, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackKnight.png`, position: {x: 6, y: 7}, type: PieceType.KNIGHT, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackBishop.png`, position: {x: 2, y: 7}, type: PieceType.BISHOP, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackBishop.png`, position: {x: 5, y: 7}, type: PieceType.BISHOP, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackQueen.png`, position: {x: 3, y: 7}, type: PieceType.QUEEN, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackKing.png`, position: {x: 4, y: 7}, type: PieceType.KING, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackPawn.png`, position: {x: 0, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackPawn.png`, position: {x: 1, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackPawn.png`, position: {x: 2, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackPawn.png`, position: {x: 3, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackPawn.png`, position: {x: 4, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackPawn.png`, position: {x: 5, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackPawn.png`, position: {x: 6, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT,
    },
    {
        image: `assets/images/blackPawn.png`, position: {x: 7, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT,
    }
]