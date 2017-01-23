class Game {
    dimensionGameField: number;
    gameNumber: number = 1;
    players: Array<Player> = [];
	
    constructor(dimensionGameField: number) {
	this.dimensionGameField = dimensionGameField;
	this.getRandomSymbol();
    }

    getDimensionGameField(): number {
	return this.dimensionGameField;
    }

    getGameNumber(): number {
	return this.gameNumber;
    }
	
    increaseGameNumber() {
	this.gameNumber++;
    }

    addPlayer(player: Player): void {
	this.players.push(player);
    }

    refreshPlayersSymbols(): void {
    	let symbls: Array<string> = this.getRandomSymbol();
    	if (this.players.length === 2) {
	    this.players[0].symbl = symbls[0];
	    this.players[1].symbl = symbls[1];
    	}

    	for (let i = 0; i < this.players.length; i++) {
            this.players[i].active =  this.players[i].symbl === "x" ? true : false;
    	}

    	$("[data-simbol-pleyer1]").html(this.players[0].symbl);
	$("[data-simbol-pleyer2]").html(this.players[1].symbl);
    }

    getRandomSymbol(): Array<string> {
	let symbls: Array<string> = [];
        let num: number = Math.floor((Math.random() * 2) + 1); // get random 1 or 2 
        if (num === 1) {
	    symbls[0] = "o";
	    symbls[1] = "x";
	} else {
	    symbls[0] = "x";
	    symbls[1] = "o";    
	}
	return symbls;
    }

    winByMainDiagonal(symbl: string): boolean {
        for (let i = 1; i <= this.dimensionGameField; i++ ) {
            for (let j = 1; j <= this.dimensionGameField; j++) {
                if (i === j) {
                    let cell = String(i) + String(j);
                    if ($("table.gamestable").find('[data-cell="' + cell + '"]').text() !== symbl) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    winBySecondaryDiagonal(symbl: string): boolean  {
        for (let i = 1; i <= this.dimensionGameField; i++ ) {
            for (let j = 1; j <= this.dimensionGameField; j++) {
                if (i + j === this.dimensionGameField + 1) {
                    let cell = String(i) + String(j);
                    if ($("table.gamestable").find('[data-cell="' + cell + '"]').text() !== symbl) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    winByRow(row: number, symbl: string): boolean {
    	for (let j = 1; j <= this.dimensionGameField; j++) {
            let cell = String(row) + String(j);
            if ($("table.gamestable").find('[data-cell="' + cell + '"]').text() !== symbl) {
                return false;
            }	
        }
        return true;
    }

    winByColumn(column: number, symbl: string): boolean {
	for (let i = 1; i<= this.dimensionGameField; i++) {
            let cell = String(i) + String(column);
            if ($("table.gamestable").find('[data-cell="' + cell + '"]').text() !== symbl) {
                return false;
            }	
        }
        return true;
    }

    colorize(cells: string, num: number ): void {
    	let cell: string;
    	if (cells === "mainDiagonal" || cells === "secondaryDiagonal") {
	    for (let i = 1; i <= this.dimensionGameField; i++ ) {
		for (let j = 1; j <= this.dimensionGameField; j++) {
		    cell = String(i) + String(j);
		    if (cells === "mainDiagonal" && i === j) {
                        $("table.gamestable").find('[data-cell="' + cell + '"]').addClass("red_txt");
                    }
        	    if (cells === "secondaryDiagonal" && i + j === this.dimensionGameField + 1) {
                        $("table.gamestable").find('[data-cell="' + cell + '"]').addClass("red_txt");
		    }
		}
            } 
	}
	if (cells === "row") {
            for (let j = 1; j <= this.dimensionGameField; j++) {
	        cell = String(num) + String(j);
	        $("table.gamestable").find('[data-cell="' + cell + '"]').addClass("red_txt");
	    }	
        }
	if (cells === "column") {
            for (let i = 1; i<= this.dimensionGameField; i++) {
	        cell = String(i) + String(num);
	        $("table.gamestable").find('[data-cell="' + cell + '"]').addClass("red_txt");;
	    }
	}
    }

    /*
     * win cases:
     * 1) equal elements on main diagonal - i = j
     * 2) equal elements of secondary diagonal - i + j = N +1
     * 3) equal elements by row i
     * 4) equal elements by column j
     */
    checkWin(cell: JQuery): boolean {
        let numberCell = cell.attr("data-cell"); 
        let row = numberCell[0];
        let column = numberCell[1];
        let symbl = cell.text();
 
        if (row === column) {
            if (this.winByMainDiagonal(symbl) === true) {
                this.colorize("mainDiagonal", 0);
                return true;
            }
        } else {
            if (Number(row) + Number(column) === this.dimensionGameField + 1) {
                if (this.winBySecondaryDiagonal(symbl) === true) {
                    this.colorize("secondaryDiagonal", 0);
                    return true;
                }
            }
        }

        if (this.winByRow(Number(row), symbl) === true)  {
            this.colorize("row", Number(row));
            return true;
        }
        
        if (this.winByColumn(Number(column), symbl) === true) {
            this.colorize("column", Number(column));
            return true;
        }        

        return false;    
    }

    refresh(): void {
    	for (let i = 1; i <= this.dimensionGameField; i++ ) {
            for (let j = 1; j <= this.dimensionGameField; j++) {
            	let cell = String(i) + String(j);
            	let cellObj: JQuery = $("table.gamestable").find('[data-cell="' + cell + '"]');
                cellObj.text("");
		if (cellObj.hasClass("current_cell") ) {
                    cellObj.removeClass("current_cell");
		}
                if (cellObj.hasClass("red_txt") ) {
                    cellObj.removeClass("red_txt");
		}
            }
        }   

	this.setFirstActiveCellOfGame();
	this.increaseGameNumber();
	this.showGameNumber();
	this.refreshPlayersSymbols();
    }

    showGameNumber(): void {
    	$("[data-game-title]").html("Game "  + this.getGameNumber());
    }

    setFirstActiveCellOfGame(): void {
    	$('td[data-cell="11"]').addClass("current_cell");
    }
}

class ControlKyes {
    up: number;
    down: number;
    left: number;
    right: number;
    marked: number;

    constructor(up: number, down: number, left: number, right: number, marked: number) {
	this.up = up;
	this.down = down;
	this.left = left;
	this.right = right;
	this.marked = marked;
    }
}

/*
 * Player 1 use keys w(87) - like up, s(83) - like down, a(65) - to the left, d(68) - to the right, z(90) - set X or O
 * Player 2 use keys arrow Up(38) - like up, arrow Down(40) - like down, arrow Left(37) - to the left, arrow Right(39) - to the right, 9(57) - set X or O
 */
class Player {
    name: string;
    active: boolean = false;
    score: number = 0;
    symbl: string;
    controlKeys: ControlKyes;
    game: Game;

    constructor(name: string, symbl: string, game: Game) {
        this.name = name;
        this.symbl = symbl;
	if (this.symbl === "x") {
	    this.active = true;
	}
	this.game = game;
	this.game.addPlayer(this);
    }

    getName(): string {
        return this.name;
    }

    setActive(flag: boolean): void {
    	this.active = flag;
    } 

    getActive(): boolean {
    	return this.active;
    }

    setControlKyes(up, down, left, right, marked): void {
    	this.controlKeys = new ControlKyes(up, down, left, right, marked);
    }
    
    moveUp(cell: string): string {
 	let row: number = Number(cell[0]) - 1;
        let column: number = Number(cell[1]);
        return  row >= 1 && row <= this.game.getDimensionGameField() ? String(row) + column : cell;   
    }

    moveDown(cell: string): string {
 	let row: number = Number(cell[0]) + 1;
        let column: number = Number(cell[1]);
        return  row >= 1 && row <= this.game.getDimensionGameField() ? String(row) + column : cell;    
    }

    moveLeft(cell: string): string {
 	let row: number = Number(cell[0]);
        let column: number = Number(cell[1]) - 1;
        return  column >= 1 && column <= this.game.getDimensionGameField() ? String(row) + column : cell;       
    }

    moveRight(cell: string): string {
        let row: number = Number(cell[0]);
        let column: number = Number(cell[1]) + 1;
        return  column >= 1 && column <= this.game.getDimensionGameField() ? String(row) + column : cell;
    }

    increasePlayerScore(): void {
    	this.score++;
    	$("[data-score-" + this.getName() + "]").html(String(this.score) + " won");
    }

    paintSymbol(symbl): void {
 	let currentCell: JQuery = $("table").find("td.current_cell");    
        currentCell.html(symbl);  
        if (this.game.checkWin(currentCell)) {
            this.increasePlayerScore();
            setTimeout(() => this.game.refresh(), 1000);
        } 
    }

    doAction(code: number, cell: string): string {
    	let newCell: string = cell;
    	if (code === this.controlKeys.up || code === this.controlKeys.down 
            || code === this.controlKeys.left || code === this.controlKeys.right
            || code === this.controlKeys.marked) {
	    switch (code) {
	        case this.controlKeys.up:
	            newCell = this.moveUp(cell);
	            break;
	        case this.controlKeys.down: 
	            newCell = this.moveDown(cell);
	            break;
	        case this.controlKeys.left: 
	            newCell = this.moveLeft(cell);
	            break;
	        case this.controlKeys.right: 
	            newCell = this.moveRight(cell);
	            break;
	        case this.controlKeys.marked:
                    if ($("table.gamestable").find('[data-cell="' + cell + '"]').text().length === 0) {
                        this.paintSymbol(this.symbl);
                    }       
                    break;
	    }	
        }
        return newCell;
    }
}

let game: Game = new Game(3);
$("[data-game-title]").html("Game "  + game.getGameNumber());  
game.setFirstActiveCellOfGame();

let symbl = game.getRandomSymbol();	    
let player1: Player = new Player("Player1", symbl[0], game);
$("[data-name-player1]").html(player1.getName());
let player2: Player = new Player("Player2", symbl[1], game);
$("[data-name-player2]").html(player2.getName());

$("[data-simbol-pleyer1]").html(player1.symbl);
$("[data-simbol-pleyer2]").html(player2.symbl);

$("[data-score-player1]").html(String(player1.score) + " won");
$("[data-score-player2]").html(String(player2.score) + " won");

player1.setControlKyes(87, 83, 65, 68, 90);
player2.setControlKyes(38, 40, 37, 39, 57); 

$(document).on("keydown", function(event) {
    let currentCell = $("table").find("td.current_cell");
    let numberCurrentCell = currentCell.attr("data-cell"); 
    let newCell: string;
    if (player1.active === true) {
        newCell = player1.doAction(event.keyCode, numberCurrentCell);
        if (event.keyCode === player1.controlKeys.marked) {
            if (currentCell.text() === player1.symbl) {
                player1.active = false;
                player2.active = true;
            }
        }
    } else {
        newCell = player2.doAction(event.keyCode, numberCurrentCell); 
        if (event.keyCode === player2.controlKeys.marked) {
            if (currentCell.text() === player2.symbl) {
                player1.active = true;
                player2.active = false;
            }
        }
    }

    currentCell.removeClass("current_cell");
    if (newCell) {
    	$("table.gamestable").find('[data-cell="' 
            + newCell + '"]').addClass("current_cell");    
    }
});