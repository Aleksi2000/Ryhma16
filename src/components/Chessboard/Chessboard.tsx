import './Chessboard.css'
import Tile from '../Tile/Tile'
import { useEffect, useRef, useState } from 'react'
import Referee from "../../referee/Referee"
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE, Piece, PieceType, TeamType, initialBoardState, Position, samePosition, socket } from '../../Constants'


export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
    const [promotionPawn, setPromotionPawn] = useState<Piece>()
    const [grabPosition, setGrapPosition] = useState<Position>({ x: -1, y: -1 })
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState)
    const chessboardRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    const referee = new Referee()
    const impact = require('../../impact.wav')
    const [whatSide, setWhatSide] = useState()
    const [userName, setUserName] = useState('')
    const [enemyName, setEnemyName] = useState('')
    const [playerTwo, setPlayerTwo] = useState('')
    const [playerTwoEnemy, setPlayerTwoEnemy] = useState('')


    socket.on("side", (side) =>{
        setWhatSide(side) 
    })


    function playImpactSound(volume: number) {
        const audio = new Audio(impact);
        audio.volume = volume;
        audio.play();
      }

    
    socket.on("move", (data) => {
        setPieces(data)  
      })


useEffect(() => {
    const user = localStorage.getItem("username")
    if(user !== null){
        if(whatSide === 0 ){
            setEnemyName(user)
        }
        else if(whatSide === 1){
        setUserName(user)
        }
    }
    },[whatSide])

    if(userName === null) {
        socket.on("username", (username) => {
                setUserName(username)
        })     
    } else if(userName !== null){
        socket.on("username", (username) => {
                setEnemyName(username)
    })
}
if(enemyName === null) {
    socket.on("username2", (username) => {
            setPlayerTwoEnemy(username)
    })     
} else if(enemyName !== null || userName === null){
    socket.on("username2", (username) => {
            setPlayerTwo(username)
})
}


/* JÄI SHAKKIMATTI KESKEN
function findKing(pieces: Piece[]){
    let whiteKing: Position | null = null
    let blackKing: Position | null = null
    for (const piece of pieces){
        if(piece.type === PieceType.KING){
            if(piece.team === 1){
                whiteKing = piece.position
            } else {
                blackKing = piece.position
            }
        }
    }
    return {whiteKing, blackKing}
}

function checkKingStatus() {
    const kingStatus = findKing(pieces)

    console.log(whatSide,"Own king side")
    const opponentPiecesPosition = findEnemyPieces(pieces)
    console.log(opponentPiecesPosition,"opponentPiecesPosition")
    console.log(kingStatus,"kingstatus")
   
    for (const piece of opponentPiecesPosition){
       let kingPosition: Position
       if(piece.team === 1){
        if (!kingStatus.whiteKing) return
        kingPosition = kingStatus.whiteKing
       } else {
        if (!kingStatus.blackKing) return;
        kingPosition = kingStatus.blackKing;
      }
      
        console.log("King is in check!");
        return;
    
}

}

function findEnemyPieces(pieces: Piece []){
    return pieces
    .filter((p) => p.team !== whatSide)
    .map((p)=> ({position: p.position, type: p.type, team: p.team}))
}
*/

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement
    const chessboard = chessboardRef.current
    if(element.classList.contains("chess-piece") && chessboard) {
        const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE)
        const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE))
        setGrapPosition({ x: grabX, y: grabY })

        const x = e.clientX - GRID_SIZE / 2
        const y = e.clientY - GRID_SIZE / 2
        element.style.position = "absolute"
        element.style.left = `${x}px`
        element.style.top = `${y}px`

        setActivePiece(element)
    }
}

function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current
    if(activePiece && chessboard) {
        const minX = chessboard.offsetLeft - 50
        const minY = chessboard.offsetTop - 50
        const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50
        const maxY = chessboard.offsetTop + chessboard.clientHeight - 50
        const x = e.clientX -50
        const y = e.clientY -50
        activePiece.style.position = "absolute"

        if (x < minX) {
            activePiece.style.left = `${minX}px`
        } 
        else if (x > maxX) {
            activePiece.style.left = `${maxX}px`
        } 
        else {
            activePiece.style.left = `${x}px`
        }

        if (y < minY) {
            activePiece.style.top = `${minY}px`
        } 
        else if (y > maxY) {
            activePiece.style.top = `${maxY}px`
        } 
        else { 
            activePiece.style.top = `${y}px`
        }
    }
}

function dropPiece(e: React.MouseEvent) {
  
    const chessboard = chessboardRef.current
    if(activePiece && chessboard) {
        const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE)
        const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE))

        const currentPiece = pieces.find((p) => samePosition(p.position, grabPosition))

        if(currentPiece){
            const validMove = referee.isValidMove(grabPosition, {x, y}, currentPiece.type, currentPiece.team, pieces)
                    
            const isEnPassantMove = referee.isEnPassantMove(grabPosition, {x, y}, currentPiece.type, currentPiece.team, pieces)

            const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1
            
            if(isEnPassantMove && currentPiece.team === whatSide) {
                const updatedPieces = pieces.reduce((results, piece) => {
                    if(samePosition(piece.position, grabPosition)) {
                        piece.enPassant = false
                        piece.position.x = x
                        piece.position.y = y
                        results.push(piece)
                    } else if(!samePosition(piece.position, { x, y: y - pawnDirection})) {
                        if(piece.type === PieceType.PAWN) {
                            piece.enPassant = false
                        }
                        results.push(piece)
                        
                    }
                    
                    return results
                },[] as Piece[])
                
                setPieces(updatedPieces)
                socket.emit("move", updatedPieces)

            } else if (validMove && currentPiece.team === whatSide) { 
                
                playImpactSound(1)

            const updatedPieces = pieces.reduce((results, piece) => {
                if (samePosition(piece.position, grabPosition)) {
                    piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN
                    
                    piece.position.x = x
                    piece.position.y = y

                    let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0

                    if(y === promotionRow && piece.type === PieceType.PAWN) {
                        modalRef.current?.classList.remove("hidden")
                        setPromotionPawn(piece)
                    }
                    results.push(piece)
                } else if(!(samePosition(piece.position, {x, y}))) {
                    if(piece.type === PieceType.PAWN) {
                        piece.enPassant = false
                    }
                    
                    results.push(piece)
                    
                }
            
                return results
                
            }
            , [] as Piece []
            )
            setPieces(updatedPieces)
            console.log(updatedPieces,'updated pieces')
            socket.emit("move", updatedPieces)
            
        }  else {
            activePiece.style.position = 'relative'
            activePiece.style.removeProperty('Top')
            activePiece.style.removeProperty('Left')
        }

        }
        setActivePiece(null)
    }
    
}

function promotePawn(pieceType: PieceType) {
    if(promotionPawn === undefined) {
        return
    }

    const updatedPieces = pieces.reduce((results, piece) => {
        if(samePosition(piece.position, promotionPawn?.position)) {
            piece.type = pieceType
            const teamType = (piece.team === TeamType.OUR) ? "white" : "black"
            let image = ""
            switch(pieceType) {
                case PieceType.QUEEN: {
                    image = "Queen"
                    break
                }
                case PieceType.KNIGHT: {
                    image = "Knight"
                    break
                }
                case PieceType.ROOK: {
                    image = "Rook"
                    break
                }
                case PieceType.BISHOP: {
                    image = "Bishop"
                    break
                }
            }
            piece.image = `assets/images/${teamType}${image}.png`
        }
        results.push(piece)
        return results
    }, [] as Piece[])
    setPieces(updatedPieces)
    socket.emit("move", updatedPieces)

    modalRef.current?.classList.add("hidden")
}

function promotionTeamType() {
    return (promotionPawn?.team === TeamType.OUR) ? "white" : "black"
}

    let board = []

    for (let j = VERTICAL_AXIS.length -1; j >= 0; j--) {
     for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
        const number = j + i + 2;
        const piece = pieces.find((p) => samePosition(p.position, {x: i, y: j}))
        let image = piece ? piece.image : undefined

        board.push(<Tile key={`${j},${i}`} image={image} number={number} />)
        }
    }

    return  (
        <>
        <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
            <div className="modal-body">
            <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/${promotionTeamType()}Queen.png`}/>
            <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/${promotionTeamType()}Knight.png`}/>
            <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/${promotionTeamType()}Rook.png`}/>
            <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/${promotionTeamType()}Bishop.png`}/>
            </div>
        </div>
        <div className='nimi1'>
            {enemyName ? enemyName : playerTwoEnemy}
        </div >
        
            <div 
            onMouseMove={(e) => movePiece(e)} 
            onMouseDown={e => grabPiece(e)}
            onMouseUp={e => dropPiece(e)}
            id="chessboard"
            ref={chessboardRef}
            >
                {board}
            </div>
            <div className='nimi2'>
                {userName ? userName : playerTwo}
            </div>
        </>
    )
}