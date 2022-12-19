import './Chessboard.css';
import Tile from '../Tile/Tile';
import { useRef, useState } from 'react';
import Referee from "../../referee/Referee";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE, Piece, PieceType, TeamType, initialBoardState, Position, samePosition, socket } from '../../Constants'


export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPosition, setGrapPosition] = useState<Position>({ x: -1, y: -1 });
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();
    
    socket.on("move", (data) => {
        console.log("liike",data)
        console.log("Vastaanottaa")
        setPieces(data)  
      }
      )

function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if(element.classList.contains("chess-piece") && chessboard) {
        const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE)
        const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE))
        setGrapPosition({ x: grabX, y: grabY });

        const x = e.clientX - GRID_SIZE / 2;
        const y = e.clientY - GRID_SIZE / 2;
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        setActivePiece(element);
    }
}

function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if(activePiece && chessboard) {
        const minX = chessboard.offsetLeft - 50;
        const minY = chessboard.offsetTop - 50;
        const maxX = chessboard.offsetLeft + chessboard.clientWidth - 50;
        const maxY = chessboard.offsetTop + chessboard.clientHeight - 50;
        const x = e.clientX -50;
        const y = e.clientY -50;
        activePiece.style.position = "absolute";

        if (x < minX) {
            activePiece.style.left = `${minX}px`;
        } 
        else if (x > maxX) {
            activePiece.style.left = `${maxX}px`
        } 
        else {
            activePiece.style.left = `${x}px`
        }

        if (y < minY) {
            activePiece.style.top = `${minY}px`;
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
    const chessboard = chessboardRef.current;
    if(activePiece && chessboard) {
        const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
        const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));

        const currentPiece = pieces.find((p) => samePosition(p.position, grabPosition));

        if(currentPiece){
            const validMove = referee.isValidMove(grabPosition, {x, y}, currentPiece.type, currentPiece.team, pieces)
            
                

            const isEnPassantMove = referee.isEnPassantMove(grabPosition, {x, y}, currentPiece.type, currentPiece.team, pieces) 
            
        
            const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;
            
            if(isEnPassantMove) {
                const updatedPieces = pieces.reduce((results, piece) => {
                    if(samePosition(piece.position, grabPosition)) {
                        piece.enPassant = false
                        piece.position.x = x
                        piece.position.y = y
                        results.push(piece)
                    } else if(!samePosition(piece.position, { x, y: y - pawnDirection})) {
                        if(piece.type === PieceType.PAWN) {
                            piece.enPassant = false;
                        }
                        results.push(piece)
                        
                    }
                    
                    return results
                }
                ,[] as Piece[]
                );
                
                setPieces(updatedPieces)
                console.log(updatedPieces,'en passant')
                socket.emit("move", updatedPieces)

            } else if (validMove) {
            //AAONBGPWOERGHBPOIWEUBGOIWEUBGIOUEWBG
            //AAONBGPWOERGHBPOIWEUBGOIWEUBGIOUEWBG
            const updatedPieces = pieces.reduce((results, piece) => {
                if (samePosition(piece.position, grabPosition)) {
                    //qwwqagwegweqgwqegqweg
                    piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN
                    
                    piece.position.x = x
                    piece.position.y = y
                    results.push(piece)
                    console.log(piece, 'mikä tää on')
                } else if(!(samePosition(piece.position, {x, y}))) {
                    if(piece.type === PieceType.PAWN) {
                        piece.enPassant = false;
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
            //AWWPESOIUHGPUIJOQWAEHBGÅPOEWAIUGHB
            activePiece.style.position = 'relative';
            activePiece.style.removeProperty('Top');
            activePiece.style.removeProperty('Left');
        }

        }
        setActivePiece(null);
    }
    
}
   
    

    let board = [];

    for (let j = VERTICAL_AXIS.length -1; j >= 0; j--) {
     for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
        const number = j + i + 2;
        const piece = pieces.find((p) => samePosition(p.position, {x: i, y: j}))
        let image = piece ? piece.image : undefined;

        board.push(<Tile key={`${j},${i}`} image={image} number={number} />)
        }
    }

    return  (
        <div 
        onMouseMove={(e) => movePiece(e)} 
        onMouseDown={e => grabPiece(e)}
        onMouseUp={e => dropPiece(e)}
        id="chessboard"
        ref={chessboardRef}
        >
            {board}
        </div>
    )
}