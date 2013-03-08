var lifeG = {};
(function() {
    ///////////// Cell class ///////////////////////////////////////
    var Cell = function(isAlive) {
        this.isAlive = isAlive;
        this.isNextGenerationAlive = false;
    };

    lifeG.Cell = Cell;

    Cell.prototype.prepareNextGeneration = function(neighbourCells) {
        function countAliveCells(cells) {
            var count = 0;
            cells.forEach(function(cell) {
                if (cell.isAlive) { count++; }
            });
            return count;
        }
        var aliveNeighbourCellCount = countAliveCells(neighbourCells);
        if (this.isAlive) {
            if (aliveNeighbourCellCount !== 2 && aliveNeighbourCellCount !== 3) {
                this.isNextGenerationAlive = false;
            } else {
                this.isNextGenerationAlive = true;
            }
        } else {
            if (aliveNeighbourCellCount === 3) {
                this.isNextGenerationAlive = true;
            } else {
                this.isNextGenerationAlive = false;
            }
        }
    };
    Cell.prototype.gotoNextGeneration = function() {
        if (this.isNextGenerationAlive) {
            this.isAlive = true;
        } else {
            this.isAlive = false;
        }
    };

    ///////////// CellGrid class ///////////////////////////////////////
    var CellGrid = function(rowSize, columnSize) {
        this.rowSize = rowSize;
        this.columnSize = columnSize;
        this.cellArray = [];
        this.generation = 0;
        CellGrid.prototype.createRandomGrid.call(this);
    };

    lifeG.CellGrid = CellGrid;

    CellGrid.prototype.getCell = function(row, column) {
        return cellArray[row][column];
    };
    CellGrid.prototype.createRandomGrid = function() {
        var row;
        var column;
        this.generation = 0;
        for (row = 0; row < this.rowSize; row++) {
            var rowArray = [];
            for (column = 0; column < this.columnSize; column++) {
                var oneOrZero = Math.floor(Math.random() * 2.0);
                if (oneOrZero === 1) {
                    rowArray[column] = new Cell(true);
                } else {
                    rowArray[column] = new Cell(false);
                }
            }
            this.cellArray[row] = rowArray;
        }
    };
    CellGrid.prototype.reset = function() {
        this.createRandomGrid();
    };
    CellGrid.prototype.getCell = function(row, column) {
        return this.cellArray[row][column];
    };
    CellGrid.prototype.getGeneration = function() {
        return this.generation;
    };
    CellGrid.prototype.getNeighbourCells = function(targetRow, targetColumn) {
        var neighbourCells = [];
        var minRow = Math.max(0, targetRow - 1);
        var minColumn = Math.max(0, targetColumn - 1);
        var maxRow = Math.min(this.rowSize - 1, targetRow + 1);
        var maxColumn = Math.min(this.columnSize - 1, targetColumn + 1);
        var row;
        var column;
        for (row = minRow; row <= maxRow; row++) {
            for (column = minColumn; column <= maxColumn; column++) {
                if (row === targetRow && column === targetColumn) {continue;}
                var cell = this.getCell(row, column);
                neighbourCells.push(cell);
            }
        }
        return neighbourCells;
    };
    CellGrid.prototype.forEach = function(func) {
        var row;
        var column;
        for (row = 0; row < this.rowSize; row++) {
            for (column = 0; column < this.columnSize; column++) {
                var cell = this.getCell(row, column);
                func(cell, row, column);
            }
        }
    };
    CellGrid.prototype.prepareNextGeneration = function() {
        var thisCellGrid = this;
        this.forEach(function(cell, row, column) {
            var neighbourCells = thisCellGrid.getNeighbourCells(row, column);
            cell.prepareNextGeneration(neighbourCells);
        });
    };
    CellGrid.prototype.gotoNextGeneration = function() {
        this.forEach(function(cell, row, column) {
            cell.gotoNextGeneration();
        });
        this.generation++;
    };


    ///////////// Lifegame class ///////////////////////////////////////
    var Lifegame = function(gridWidth, gridHeight) {
        this.gridCanvasWidth = gridWidth;
        this.gridCanvasHeight = gridHeight;
        this.rowSize = 30;
        this.columnSize = 50;
        this.duration_msec = 200;
        this.canceled = false;

        this.cellGrid = new CellGrid(this.rowSize, this.columnSize);
        Lifegame.prototype.updateCellGridView.call(this);
    };

    lifeG.Lifegame = Lifegame;

    Lifegame.prototype.updateCellGridView = function() {
        var canvas = $('#cell_grid')[0];
        if (!canvas || !canvas.getContext) {return;}
        var ctx = canvas.getContext('2d');
        var cellWidth = this.gridCanvasWidth / this.columnSize;
        var cellHeight = this.gridCanvasHeight / this.rowSize;
        ctx.beginPath();
        this.cellGrid.forEach(function(cell, row, column) {
            if (cell.isAlive) {
                ctx.fillStyle = 'rgb(70, 70, 255)';
            } else {
                ctx.fillStyle = 'rgb(255, 255, 255)';
            }
            ctx.fillRect(cellWidth * column, cellHeight * row, cellWidth, cellHeight);
            ctx.strokeStyle = 'rgb(150, 150, 150)';
            ctx.strokeRect(cellWidth * column, cellHeight * row, cellWidth, cellHeight);
        });
        ctx.closePath();
        $('#generation').text('' + this.cellGrid.getGeneration());
    };
    Lifegame.prototype.tick = function() {
        if (this.canceled) {return;}

        this.cellGrid.prepareNextGeneration();
        this.cellGrid.gotoNextGeneration();
        this.updateCellGridView();
        _this = this;
        setTimeout(function() { _this.tick(); }, this.duration_msec);
    };
    Lifegame.prototype.start = function() {
        this.canceled = false;
        this.tick();
        $('#start_button').prop('disabled', true);
    };
    Lifegame.prototype.stop = function() {
        this.canceled = true;
        $('#start_button').prop('disabled', false);
    };
    Lifegame.prototype.reset = function() {
        this.stop();
        this.cellGrid.reset();
        this.updateCellGridView();
    };
})();
