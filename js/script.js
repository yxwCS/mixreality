const gridSize = 4;

function initPuzzle(imagePath) {
    const puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    let pieces = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        pieces.push(i);
    }

    pieces.sort(() => Math.random() - 0.5);

    for (let i = 0; i < pieces.length; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.width = `${puzzleContainer.offsetWidth / gridSize}px`;
        piece.style.height = `${puzzleContainer.offsetHeight / gridSize}px`;
        piece.style.backgroundImage = `url('${imagePath}')`;
        const x = -(pieces[i] % gridSize) * (400 / gridSize);
        const y = -Math.floor(pieces[i] / gridSize) * (400 / gridSize);
        piece.style.backgroundPosition = `${x}px ${y}px`;
        piece.addEventListener('dragstart', handleDragStart, false);
        piece.addEventListener('dragover', handleDragOver, false);
        piece.addEventListener('drop', handleDrop, false);
        piece.addEventListener('dragend', handleDragEnd, false);
        puzzleContainer.appendChild(piece);
    }
}

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }
    return false;
}

function handleDragEnd(e) {
    checkIfSolved();
}

document.addEventListener('DOMContentLoaded', function() {
    initPuzzle('path/to/your/image.jpg');
});
