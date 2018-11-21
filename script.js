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
    }
}