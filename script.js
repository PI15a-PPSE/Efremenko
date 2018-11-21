window.onload = function() {    
    //The initial setup
    var gameBoard = [ 
        [  0,  1,  0,  1,  0,  1,  0,  1 ],
        [  1,  0,  1,  0,  1,  0,  1,  0 ],
        [  0,  1,  0,  1,  0,  1,  0,  1 ],
        [  0,  0,  0,  0,  0,  0,  0,  0 ],
        [  0,  0,  0,  0,  0,  0,  0,  0 ],
        [  2,  0,  2,  0,  2,  0,  2,  0 ],
        [  0,  2,  0,  2,  0,  2,  0,  2 ],
        [  2,  0,  2,  0,  2,  0,  2,  0 ]
    ];
    //arrays to store the instances
    var pieces = [];
    var tiles = []; 
    
    //distance formula
    var dist = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
    }
    //Piece object - there are 24 instances of them in a checkers game
    function Piece (element, position) {
        //linked DOM element
        this.element = element;
        //positions on gameBoard array in format row, column
        this.position = position; 
        //which player's piece i it
        this.player = '';
        //figure out player by piece id
        if(this.element.attr("id") < 12)
            this.player = 1;
        else
            this.player = 2;
        //makes object a king
        this.king = false;
        this.makeKing = function () {
            this.element.css("backgroundImage", "url('king"+this.player+".png')");
            this.king = true;
        }
        //moves the piece
        this.move = function (tile) { 
            this.element.removeClass('selected'); 
            if(!Board.isValidPlacetoMove(tile.position[0], tile.position[1])) return false;
            //make sure piece doesn't go backwards if it's not a king
            if(this.player == 1 && this.king == false) {
                if(tile.position[0] < this.position[0]) return false;
            } else if (this.player == 2 && this.king == false) {
                if(tile.position[0] > this.position[0]) return false;
            }
            //remove the mark from Board.board and put it in the new spot
            Board.board[this.position[0]][this.position[1]] = 0;
            Board.board[tile.position[0]][tile.position[1]] = this.player;
            this.position = [tile.position[0], tile.position[1]];
            //change the css using board's dictionary
            this.element.css('top', Board.dictionary[this.position[0]]);
            this.element.css('left', Board.dictionary[this.position[1]]);
            //if piece reaches the end of the row on opposite side crown it a king (can move all directions)
            if(!this.king && (this.position[0] == 0 || this.position[0] == 7 )) 
                this.makeKing();
            Board.changePlayerTurn();
            return true;
        };
        
        //tests if piece can jump anywhere
        this.canJumpAny = function () {
            if(this.canOpponentJump([this.position[0]+2, this.position[1]+2]) ||
                 this.canOpponentJump([this.position[0]+2, this.position[1]-2]) ||
                 this.canOpponentJump([this.position[0]-2, this.position[1]+2]) ||
                 this.canOpponentJump([this.position[0]-2, this.position[1]-2])) {
                return true;
            } return false;
        };
        
        //tests if an opponent jump can be made to a specific place
        this.canOpponentJump = function(newPosition) {
            //find what the displacement is
            var dx = newPosition[1] - this.position[1];
            var dy = newPosition[0] - this.position[0];
            //make sure object doesn't go backwards if not a king
            if(this.player == 1 && this.king == false) {
                if(newPosition[0] < this.position[0]) return false;
            } else if (this.player == 2 && this.king == false) {
                if(newPosition[0] > this.position[0]) return false;
            }
            //must be in bounds
            if(newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) return false;
            //middle tile where the piece to be conquered sits
            var tileToCheckx = this.position[1] + dx/2;
            var tileToChecky = this.position[0] + dy/2;
            //if there is a piece there and there is no piece in the space after that
            if(!Board.isValidPlacetoMove(tileToChecky, tileToCheckx) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])) {
                //find which object instance is sitting there
                for(pieceIndex in pieces) {
                    if(pieces[pieceIndex].position[0] == tileToChecky && pieces[pieceIndex].position[1] == tileToCheckx) {
                        if(this.player != pieces[pieceIndex].player) {
                            //return the piece sitting there
                            return pieces[pieceIndex];
                        }
                    }
                }
            }
            return false;
        };
        
        this.opponentJump = function (tile) {
            var pieceToRemove = this.canOpponentJump(tile.position);
            //if there is a piece to be removed, remove it
            if(pieceToRemove) {
                pieces[pieceIndex].remove();
                return true;
            }
            return false;
        };
        
        this.remove = function () {
            //remove it and delete it from the gameboard
            this.element.css("display", "none");
            if(this.player == 1) $('#player2').append("<div class='capturedPiece'></div>");
            if(this.player == 2) $('#player1').append("<div class='capturedPiece'></div>");
            Board.board[this.position[0]][this.position[1]] = 0;
            //reset position so it doesn't get picked up by the for loop in the canOpponentJump method
            this.position = [];
        };
    }
        function Tile (element, position) {
        //linked DOM element
        this.element = element;
        //position in gameboard
        this.position = position;
        //if tile is in range from the piece
        this.inRange = function(piece) {
            if(dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == Math.sqrt(2)) {
                //regular move
                return 'jump';
            } else if(dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == 2*Math.sqrt(2)) {
                //jump move
                return 'regular';
            }
        };
    }
}