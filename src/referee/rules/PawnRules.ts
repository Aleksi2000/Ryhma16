import { TeamType, Piece, Position } from "../../Constants"
import { tileIsOccupied, tileIsOccupiedByOpponent, whoseTurn } from "./GeneralRules"

export const pawnMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    const specialRow = team === TeamType.OUR ? 1 : 6
    const pawnDirection = team === TeamType.OUR ? 1 : -1

    if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection) {
        if(!tileIsOccupied(desiredPosition, boardState) && !tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - pawnDirection}, boardState)) {
            if(whoseTurn(team)) {
            return true
        }
    }
    } else if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
        if(!tileIsOccupied(desiredPosition, boardState)) {
            if(whoseTurn(team)) {
            return true
        }
    }
    } else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
        if(tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
            if(whoseTurn(team)) {
            return true
        }
    }
    } else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
        if(tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
            if(whoseTurn(team)) {
            return true
        }
    }
    } return false
}