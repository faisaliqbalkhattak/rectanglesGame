class RectanglesGame {
    constructor() {
        this.gridSize = 5;
        this.currentPlayer = 'player';
        this.playerScore = 0;
        this.computerScore = 0;
        this.linesDrawn = 0;
        this.lines = [];
        this.rectangles = [];
        
        this.init();
    }
    
    init() {
        this.createGameElements();
        this.bindEvents();
        this.updateUI();
    }
    
    createGameElements() {
        this.createDots();
        this.createLines();
        this.setupRectanglesGrid();
    }
    
    createDots() {
        const dotsGrid = document.querySelector('.dots-grid');
        dotsGrid.innerHTML = '';
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.dataset.row = row;
                dot.dataset.col = col;
                dotsGrid.appendChild(dot);
            }
        }
    }
    
    createLines() {
        this.createHorizontalLines();
        this.createVerticalLines();
    }
    
    createHorizontalLines() {
        const horizontalContainer = document.querySelector('.horizontal-lines');
        horizontalContainer.innerHTML = '';
        
        // Create horizontal lines (4 lines per row, 5 rows)
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 1; col++) {
                const line = document.createElement('div');
                line.className = 'line horizontal';
                line.dataset.type = 'horizontal';
                line.dataset.row = row;
                line.dataset.col = col;
                line.dataset.drawn = 'false';
                
                horizontalContainer.appendChild(line);
                this.lines.push(line);
            }
        }
    }
    
    createVerticalLines() {
        const verticalContainer = document.querySelector('.vertical-lines');
        verticalContainer.innerHTML = '';
        
        // Create vertical lines (5 lines per row, 4 rows)
        for (let row = 0; row < this.gridSize - 1; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const line = document.createElement('div');
                line.className = 'line vertical';
                line.dataset.type = 'vertical';
                line.dataset.row = row;
                line.dataset.col = col;
                line.dataset.drawn = 'false';
                
                verticalContainer.appendChild(line);
                this.lines.push(line);
            }
        }
    }
    
    setupRectanglesGrid() {
        const rectanglesContainer = document.querySelector('.rectangles-container');
        rectanglesContainer.innerHTML = '';
        
        // Create placeholder spaces for potential rectangles
        for (let row = 0; row < this.gridSize - 1; row++) {
            for (let col = 0; col < this.gridSize - 1; col++) {
                const rectSpace = document.createElement('div');
                rectSpace.className = 'rect-space';
                rectSpace.dataset.row = row;
                rectSpace.dataset.col = col;
                rectanglesContainer.appendChild(rectSpace);
            }
        }
    }
    
    bindEvents() {
        // Add click listeners to all lines
        this.lines.forEach(line => {
            line.addEventListener('click', () => this.handleLineClick(line));
        });
        
        // Bind control buttons
        document.getElementById('newGameBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        // Bind help modal
        this.setupHelpModal();
    }
    
    setupHelpModal() {
        const helpBtn = document.getElementById('helpBtn');
        const modal = document.getElementById('helpModal');
        const closeBtn = document.querySelector('.close');
        
        helpBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    handleLineClick(lineElement) {
        // Only allow drawing if it's the player's turn and line isn't already drawn
        if (this.currentPlayer !== 'player' || lineElement.dataset.drawn === 'true') {
            return;
        }
        
        this.drawLine(lineElement);
        const completedRectangles = this.checkForCompletedRectangles(lineElement);
        
        if (completedRectangles.length > 0) {
            // Player gets points and continues their turn
            this.playerScore += completedRectangles.length;
            this.markRectangles(completedRectangles, 'player');
        } else {
            // Switch turns
            this.currentPlayer = 'computer';
            setTimeout(() => this.computerTurn(), 500);
        }
        
        this.updateUI();
        this.checkGameEnd();
    }
    
    drawLine(lineElement) {
        lineElement.dataset.drawn = 'true';
        lineElement.classList.add('drawn');
        this.linesDrawn++;
    }
    
    computerTurn() {
        const availableLines = this.lines.filter(line => line.dataset.drawn === 'false');
        
        if (availableLines.length === 0) {
            this.checkGameEnd();
            return;
        }
        
        // Simple AI: random selection
        const randomLine = availableLines[Math.floor(Math.random() * availableLines.length)];
        this.drawLine(randomLine);
        
        const completedRectangles = this.checkForCompletedRectangles(randomLine);
        
        if (completedRectangles.length > 0) {
            // Computer gets points and continues their turn
            this.computerScore += completedRectangles.length;
            this.markRectangles(completedRectangles, 'computer');
            setTimeout(() => this.computerTurn(), 500);
        } else {
            // Switch turns back to player
            this.currentPlayer = 'player';
        }
        
        this.updateUI();
        this.checkGameEnd();
    }
    
    checkForCompletedRectangles(lineElement) {
        const completedRectangles = [];
        const row = parseInt(lineElement.dataset.row);
        const col = parseInt(lineElement.dataset.col);
        const type = lineElement.dataset.type;
        
        if (type === 'horizontal') {
            // Check rectangle above
            if (row > 0) {
                if (this.isRectangleComplete(row - 1, col)) {
                    completedRectangles.push({ row: row - 1, col });
                }
            }
            // Check rectangle below
            if (row < this.gridSize - 1) {
                if (this.isRectangleComplete(row, col)) {
                    completedRectangles.push({ row, col });
                }
            }
        } else if (type === 'vertical') {
            // Check rectangle to the left
            if (col > 0) {
                if (this.isRectangleComplete(row, col - 1)) {
                    completedRectangles.push({ row, col: col - 1 });
                }
            }
            // Check rectangle to the right
            if (col < this.gridSize - 1) {
                if (this.isRectangleComplete(row, col)) {
                    completedRectangles.push({ row, col });
                }
            }
        }
        
        return completedRectangles;
    }
    
    isRectangleComplete(row, col) {
        // Check if all 4 lines of a rectangle are drawn
        const topLine = this.findLine('horizontal', row, col);
        const bottomLine = this.findLine('horizontal', row + 1, col);
        const leftLine = this.findLine('vertical', row, col);
        const rightLine = this.findLine('vertical', row, col + 1);
        
        return topLine && bottomLine && leftLine && rightLine &&
               topLine.dataset.drawn === 'true' &&
               bottomLine.dataset.drawn === 'true' &&
               leftLine.dataset.drawn === 'true' &&
               rightLine.dataset.drawn === 'true';
    }
    
    findLine(type, row, col) {
        return this.lines.find(line => 
            line.dataset.type === type &&
            parseInt(line.dataset.row) === row &&
            parseInt(line.dataset.col) === col
        );
    }
    
    markRectangles(rectangles, player) {
        const rectanglesContainer = document.querySelector('.rectangles-container');
        
        rectangles.forEach(rect => {
            // Find the corresponding grid space
            const rectSpaces = rectanglesContainer.children;
            const rectIndex = rect.row * (this.gridSize - 1) + rect.col;
            const rectSpace = rectSpaces[rectIndex];
            
            if (rectSpace) {
                rectSpace.className = `rectangle ${player}`;
                rectSpace.textContent = player === 'player' ? 'P' : 'C';
                this.rectangles.push({ ...rect, player, element: rectSpace });
            }
        });
    }
    
    updateUI() {
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('computerScore').textContent = this.computerScore;
        document.getElementById('currentTurn').textContent = 
            this.currentPlayer === 'player' ? 'Player' : 'Computer';
        document.getElementById('linesDrawn').textContent = this.linesDrawn;
        
        // Add visual indication of whose turn it is
        const playerElement = document.querySelector('.player');
        const computerElement = document.querySelector('.computer');
        
        if (this.currentPlayer === 'player') {
            playerElement.style.borderLeftColor = '#48bb78';
            playerElement.style.borderLeftWidth = '6px';
            playerElement.style.background = 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, #e6e7ee 100%)';
            
            computerElement.style.borderLeftColor = '#ed8936';
            computerElement.style.borderLeftWidth = '4px';
            computerElement.style.background = '#e6e7ee';
        } else {
            computerElement.style.borderLeftColor = '#ed8936';
            computerElement.style.borderLeftWidth = '6px';
            computerElement.style.background = 'linear-gradient(135deg, rgba(237, 137, 54, 0.1) 0%, #e6e7ee 100%)';
            
            playerElement.style.borderLeftColor = '#48bb78';
            playerElement.style.borderLeftWidth = '4px';
            playerElement.style.background = '#e6e7ee';
        }
    }
    
    checkGameEnd() {
        const totalPossibleLines = (this.gridSize * (this.gridSize - 1)) * 2;
        if (this.linesDrawn >= totalPossibleLines) {
            setTimeout(() => {
                const winner = this.playerScore > this.computerScore ? 'Player' : 
                              this.computerScore > this.playerScore ? 'Computer' : 'Nobody';
                alert(`Game Over! Winner: ${winner}\nPlayer: ${this.playerScore} | Computer: ${this.computerScore}`);
            }, 500);
        }
    }
    
    resetGame() {
        this.currentPlayer = 'player';
        this.playerScore = 0;
        this.computerScore = 0;
        this.linesDrawn = 0;
        this.rectangles = [];
        this.lines = [];
        
        // Reset all lines
        document.querySelectorAll('.line').forEach(line => {
            line.dataset.drawn = 'false';
            line.classList.remove('drawn');
        });
        
        // Reset all rectangles
        document.querySelectorAll('.rectangle').forEach(rect => {
            rect.className = 'rect-space';
            rect.textContent = '';
        });
        
        this.createLines(); // Recreate lines array
        this.updateUI();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RectanglesGame();
});
