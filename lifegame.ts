/// <reference path="jquery.d.ts" />
module lifeG {
    export class Cell{
        private isNextGenerationAlive: bool;

        constructor(private isAlive: bool){
        }
        prepareNextGeneration(neighbourCells){
            function countAliveCells(cells): number {
                var count = 0;
                cells.forEach((cell) => {
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
        }
        gotoNextGeneration(){
            if (this.isNextGenerationAlive) {
                this.isAlive = true;
            } else {
                this.isAlive = false;
            }
        }
    }

    export class CellGrid{
        private cellArray: Cell[][] = [];
        private generation = 0;

        constructor(private rowSize: number, private columnSize: number) {
            this.createRandomGrid();
        }
        createRandomGrid(){
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
        }
        reset(){
            this.createRandomGrid();
        }
        getCell(row: number, column: number): Cell{
            return this.cellArray[row][column];
        }
        getGeneration(): number{
            return this.generation;
        }
        getNeighbourCells(targetRow: number, targetColumn: number): Cell[]{
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
        }
        forEach(func: (cell:Cell, row:number, column:number) => void){
            var row;
            var column;
            for (row = 0; row < this.rowSize; row++) {
                for (column = 0; column < this.columnSize; column++) {
                    var cell = this.getCell(row, column);
                    func(cell, row, column);
                }
            }
        }
        prepareNextGeneration(){
            var thisCellGrid = this;
            this.forEach(function(cell, row, column) {
                var neighbourCells = thisCellGrid.getNeighbourCells(row, column);
                cell.prepareNextGeneration(neighbourCells);
            });
        }
        gotoNextGeneration(){
            this.forEach((cell, row, column) => { cell.gotoNextGeneration(); });
            this.generation++;
        }
    }


    export class Lifegame{
        rowSize = 30;
        columnSize = 50;
        duration_msec = 200;
        canceled = false;
        cellGrid: CellGrid;

        constructor(private gridCanvasWidth, private gridCanvasHeight){
            this.cellGrid = new CellGrid(this.rowSize, this.columnSize);
            this.updateCellGridView();
        }
        updateCellGridView(){
        }
        tick(){
            if (this.canceled) {return;}

            this.cellGrid.prepareNextGeneration();
            this.cellGrid.gotoNextGeneration();
            this.updateCellGridView();
            setTimeout(() => this.tick(), this.duration_msec);
        }
        start(){
            this.canceled = false;
            this.tick();
            $('#start_button').prop('disabled', true);
        }
        stop(){
            this.canceled = true;
            $('#start_button').prop('disabled', false);
        }
        reset(){
            this.stop();
            this.cellGrid.reset();
            this.updateCellGridView();
        }
    }
}
