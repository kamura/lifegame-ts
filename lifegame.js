var lifeG;
(function (lifeG) {
    var Cell = (function () {
        function Cell(isAlive) {
            this.isAlive = isAlive;
        }
        Cell.prototype.prepareNextGeneration = function (neighbourCells) {
            function countAliveCells(cells) {
                var count = 0;
                cells.forEach(function (cell) {
                    if(cell.isAlive) {
                        count++;
                    }
                });
                return count;
            }
            var aliveNeighbourCellCount = countAliveCells(neighbourCells);
            if(this.isAlive) {
                if(aliveNeighbourCellCount !== 2 && aliveNeighbourCellCount !== 3) {
                    this.isNextGenerationAlive = false;
                } else {
                    this.isNextGenerationAlive = true;
                }
            } else {
                if(aliveNeighbourCellCount === 3) {
                    this.isNextGenerationAlive = true;
                } else {
                    this.isNextGenerationAlive = false;
                }
            }
        };
        Cell.prototype.gotoNextGeneration = function () {
            if(this.isNextGenerationAlive) {
                this.isAlive = true;
            } else {
                this.isAlive = false;
            }
        };
        return Cell;
    })();
    lifeG.Cell = Cell;    
    var CellGrid = (function () {
        function CellGrid(rowSize, columnSize) {
            this.rowSize = rowSize;
            this.columnSize = columnSize;
            this.cellArray = [];
            this.generation = 0;
            this.createRandomGrid();
        }
        CellGrid.prototype.createRandomGrid = function () {
            var row;
            var column;
            this.generation = 0;
            for(row = 0; row < this.rowSize; row++) {
                var rowArray = [];
                for(column = 0; column < this.columnSize; column++) {
                    var oneOrZero = Math.floor(Math.random() * 2.0);
                    if(oneOrZero === 1) {
                        rowArray[column] = new Cell(true);
                    } else {
                        rowArray[column] = new Cell(false);
                    }
                }
                this.cellArray[row] = rowArray;
            }
        };
        CellGrid.prototype.reset = function () {
            this.createRandomGrid();
        };
        CellGrid.prototype.getCell = function (row, column) {
            return this.cellArray[row][column];
        };
        CellGrid.prototype.getGeneration = function () {
            return this.generation;
        };
        CellGrid.prototype.getNeighbourCells = function (targetRow, targetColumn) {
            var neighbourCells = [];
            var minRow = Math.max(0, targetRow - 1);
            var minColumn = Math.max(0, targetColumn - 1);
            var maxRow = Math.min(this.rowSize - 1, targetRow + 1);
            var maxColumn = Math.min(this.columnSize - 1, targetColumn + 1);
            var row;
            var column;
            for(row = minRow; row <= maxRow; row++) {
                for(column = minColumn; column <= maxColumn; column++) {
                    if(row === targetRow && column === targetColumn) {
                        continue;
                    }
                    var cell = this.getCell(row, column);
                    neighbourCells.push(cell);
                }
            }
            return neighbourCells;
        };
        CellGrid.prototype.forEach = function (func) {
            var row;
            var column;
            for(row = 0; row < this.rowSize; row++) {
                for(column = 0; column < this.columnSize; column++) {
                    var cell = this.getCell(row, column);
                    func(cell, row, column);
                }
            }
        };
        CellGrid.prototype.prepareNextGeneration = function () {
            var thisCellGrid = this;
            this.forEach(function (cell, row, column) {
                var neighbourCells = thisCellGrid.getNeighbourCells(row, column);
                cell.prepareNextGeneration(neighbourCells);
            });
        };
        CellGrid.prototype.gotoNextGeneration = function () {
            this.forEach(function (cell, row, column) {
                cell.gotoNextGeneration();
            });
            this.generation++;
        };
        return CellGrid;
    })();
    lifeG.CellGrid = CellGrid;    
    var Lifegame = (function () {
        function Lifegame(gridCanvasWidth, gridCanvasHeight) {
            this.gridCanvasWidth = gridCanvasWidth;
            this.gridCanvasHeight = gridCanvasHeight;
            this.rowSize = 30;
            this.columnSize = 50;
            this.duration_msec = 200;
            this.canceled = false;
            this.cellGrid = new CellGrid(this.rowSize, this.columnSize);
            this.updateCellGridView();
        }
        Lifegame.prototype.updateCellGridView = function () {
        };
        Lifegame.prototype.tick = function () {
            var _this = this;
            if(this.canceled) {
                return;
            }
            this.cellGrid.prepareNextGeneration();
            this.cellGrid.gotoNextGeneration();
            this.updateCellGridView();
            setTimeout(function () {
                return _this.tick();
            }, this.duration_msec);
        };
        Lifegame.prototype.start = function () {
            this.canceled = false;
            this.tick();
            $('#start_button').prop('disabled', true);
        };
        Lifegame.prototype.stop = function () {
            this.canceled = true;
            $('#start_button').prop('disabled', false);
        };
        Lifegame.prototype.reset = function () {
            this.stop();
            this.cellGrid.reset();
            this.updateCellGridView();
        };
        return Lifegame;
    })();
    lifeG.Lifegame = Lifegame;    
})(lifeG || (lifeG = {}));
