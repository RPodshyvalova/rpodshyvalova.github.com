var Game = (function () {
    function Game(dimensionGameField) {
        this.gameNumber = 1;
        this.players = [];
        this.dimensionGameField = dimensionGameField;
        this.getRandomSymbol();
    }
    Game.prototype.getDimensionGameField = function () {
        return this.dimensionGameField;
    };
    Game.prototype.getGameNumber = function () {
        return this.gameNumber;
    };
    Game.prototype.increaseGameNumber = function () {
        this.gameNumber++;
    };
    Game.prototype.addPlayer = function (player) {
        this.players.push(player);
    };
    Game.prototype.refreshPlayersSymbols = function () {
        var symbls = this.getRandomSymbol();
        if (this.players.length === 2) {
            this.players[0].symbl = symbls[0];
            this.players[1].symbl = symbls[1];
        }
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].active = this.players[i].symbl === "x" ? true : false;
        }
        $("[data-simbol-pleyer1]").html(this.players[0].symbl);
        $("[data-simbol-pleyer2]").html(this.players[1].symbl);
    };
    Game.prototype.getRandomSymbol = function () {
        var symbls = [];
        var num = Math.floor((Math.random() * 2) + 1); // get random 1 or 2 
        if (num === 1) {
            symbls[0] = "o";
            symbls[1] = "x";
        }
        else {
            symbls[0] = "x";
            symbls[1] = "o";
        }
        return symbls;
    };
    Game.prototype.winByMainDiagonal = function (symbl) {
        for (var i = 1; i <= this.dimensionGameField; i++) {
            for (var j = 1; j <= this.dimensionGameField; j++) {
                if (i === j) {
                    var cell = String(i) + String(j);
                    if ($("table.gamestable").find('[data-cell="' + cell + '"]').text() !== symbl) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    Game.prototype.winBySecondaryDiagonal = function (symbl) {
        for (var i = 1; i <= this.dimensionGameField; i++) {
            for (var j = 1; j <= this.dimensionGameField; j++) {
                if (i + j === this.dimensionGameField + 1) {
                    var cell = String(i) + String(j);
                    if ($("table.gamestable").find('[data-cell="' + cell + '"]').text() !== symbl) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    Game.prototype.winByRow = function (row, symbl) {
        for (var j = 1; j <= this.dimensionGameField; j++) {
            var cell = String(row) + String(j);
            if ($("table.gamestable").find('[data-cell="' + cell + '"]').text() !== symbl) {
                return false;
            }
        }
        return true;
    };
    Game.prototype.winByColumn = function (column, symbl) {
        for (var i = 1; i <= this.dimensionGameField; i++) {
            var cell = String(i) + String(column);
            if ($("table.gamestable").find('[data-cell="' + cell + '"]').text() !== symbl) {
                return false;
            }
        }
        return true;
    };
    Game.prototype.colorize = function (cells, num) {
        var cell;
        if (cells === "mainDiagonal" || cells === "secondaryDiagonal") {
            for (var i = 1; i <= this.dimensionGameField; i++) {
                for (var j = 1; j <= this.dimensionGameField; j++) {
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
            for (var j = 1; j <= this.dimensionGameField; j++) {
                cell = String(num) + String(j);
                $("table.gamestable").find('[data-cell="' + cell + '"]').addClass("red_txt");
            }
        }
        if (cells === "column") {
            for (var i = 1; i <= this.dimensionGameField; i++) {
                cell = String(i) + String(num);
                $("table.gamestable").find('[data-cell="' + cell + '"]').addClass("red_txt");
                ;
            }
        }
    };
    /*
     * win cases:
     * 1) equal elements on main diagonal - i = j
     * 2) equal elements of secondary diagonal - i + j = N +1
     * 3) equal elements by row i
     * 4) equal elements by column j
     */
    Game.prototype.checkWin = function (cell) {
        var numberCell = cell.attr("data-cell");
        var row = numberCell[0];
        var column = numberCell[1];
        var symbl = cell.text();
        if (row === column) {
            if (this.winByMainDiagonal(symbl) === true) {
                this.colorize("mainDiagonal", 0);
                return true;
            }
        }
        else {
            if (Number(row) + Number(column) === this.dimensionGameField + 1) {
                if (this.winBySecondaryDiagonal(symbl) === true) {
                    this.colorize("secondaryDiagonal", 0);
                    return true;
                }
            }
        }
        if (this.winByRow(Number(row), symbl) === true) {
            this.colorize("row", Number(row));
            return true;
        }
        if (this.winByColumn(Number(column), symbl) === true) {
            this.colorize("column", Number(column));
            return true;
        }
        return false;
    };
    Game.prototype.refresh = function () {
        for (var i = 1; i <= this.dimensionGameField; i++) {
            for (var j = 1; j <= this.dimensionGameField; j++) {
                var cell = String(i) + String(j);
                var cellObj = $("table.gamestable").find('[data-cell="' + cell + '"]');
                cellObj.text("");
                if (cellObj.hasClass("current_cell")) {
                    cellObj.removeClass("current_cell");
                }
                if (cellObj.hasClass("red_txt")) {
                    cellObj.removeClass("red_txt");
                }
            }
        }
        this.setFirstActiveCellOfGame();
        this.increaseGameNumber();
        this.showGameNumber();
        this.refreshPlayersSymbols();
    };
    Game.prototype.showGameNumber = function () {
        $("[data-game-title]").html("Game " + this.getGameNumber());
    };
    Game.prototype.setFirstActiveCellOfGame = function () {
        $('td[data-cell="11"]').addClass("current_cell");
    };
    return Game;
}());
var ControlKyes = (function () {
    function ControlKyes(up, down, left, right, marked) {
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        this.marked = marked;
    }
    return ControlKyes;
}());
/*
 * Player 1 use keys w(87) - like up, s(83) - like down, a(65) - to the left, d(68) - to the right, z(90) - set X or O
 * Player 2 use keys arrow Up(38) - like up, arrow Down(40) - like down, arrow Left(37) - to the left, arrow Right(39) - to the right, 9(57) - set X or O
 */
var Player = (function () {
    function Player(name, symbl, game) {
        this.active = false;
        this.score = 0;
        this.name = name;
        this.symbl = symbl;
        if (this.symbl === "x") {
            this.active = true;
        }
        this.game = game;
        this.game.addPlayer(this);
    }
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.setActive = function (flag) {
        this.active = flag;
    };
    Player.prototype.getActive = function () {
        return this.active;
    };
    Player.prototype.setControlKyes = function (up, down, left, right, marked) {
        this.controlKeys = new ControlKyes(up, down, left, right, marked);
    };
    Player.prototype.moveUp = function (cell) {
        var row = Number(cell[0]) - 1;
        var column = Number(cell[1]);
        return row >= 1 && row <= this.game.getDimensionGameField() ? String(row) + column : cell;
    };
    Player.prototype.moveDown = function (cell) {
        var row = Number(cell[0]) + 1;
        var column = Number(cell[1]);
        return row >= 1 && row <= this.game.getDimensionGameField() ? String(row) + column : cell;
    };
    Player.prototype.moveLeft = function (cell) {
        var row = Number(cell[0]);
        var column = Number(cell[1]) - 1;
        return column >= 1 && column <= this.game.getDimensionGameField() ? String(row) + column : cell;
    };
    Player.prototype.moveRight = function (cell) {
        var row = Number(cell[0]);
        var column = Number(cell[1]) + 1;
        return column >= 1 && column <= this.game.getDimensionGameField() ? String(row) + column : cell;
    };
    Player.prototype.increasePlayerScore = function () {
        this.score++;
        $("[data-score-" + this.getName() + "]").html(String(this.score) + " won");
    };
    Player.prototype.paintSymbol = function (symbl) {
        var _this = this;
        var currentCell = $("table").find("td.current_cell");
        currentCell.html(symbl);
        if (this.game.checkWin(currentCell)) {
            this.increasePlayerScore();
            setTimeout(function () { return _this.game.refresh(); }, 1000);
        }
    };
    Player.prototype.doAction = function (code, cell) {
        var newCell = cell;
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
    };
    return Player;
}());
var game = new Game(3);
$("[data-game-title]").html("Game " + game.getGameNumber());
game.setFirstActiveCellOfGame();
var symbl = game.getRandomSymbol();
var player1 = new Player("Player1", symbl[0], game);
$("[data-name-player1]").html(player1.getName());
var player2 = new Player("Player2", symbl[1], game);
$("[data-name-player2]").html(player2.getName());
$("[data-simbol-pleyer1]").html(player1.symbl);
$("[data-simbol-pleyer2]").html(player2.symbl);
$("[data-score-player1]").html(String(player1.score) + " won");
$("[data-score-player2]").html(String(player2.score) + " won");
player1.setControlKyes(87, 83, 65, 68, 90);
player2.setControlKyes(38, 40, 37, 39, 57);
$(document).on("keydown", function (event) {
    var currentCell = $("table").find("td.current_cell");
    var numberCurrentCell = currentCell.attr("data-cell");
    var newCell;
    if (player1.active === true) {
        newCell = player1.doAction(event.keyCode, numberCurrentCell);
        if (event.keyCode === player1.controlKeys.marked) {
            if (currentCell.text() === player1.symbl) {
                player1.active = false;
                player2.active = true;
            }
        }
    }
    else {
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
