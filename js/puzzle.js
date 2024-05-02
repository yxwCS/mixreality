let dragSrcEl = null; 
let gridSize; 
let puzzleContainer; 

function addDragAndDropHandlers(piece) {
    piece.addEventListener('dragstart', handleDragStart, false);
    piece.addEventListener('dragover', handleDragOver, false);
    piece.addEventListener('drop', handleDrop, false);
    piece.addEventListener('dragend', handleDragEnd, false);
}

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    if (dragSrcEl !== this) {
        const thisParent = this.parentNode;
        if (!thisParent) return;

        // Swap elements
        thisParent.insertBefore(dragSrcEl, this.nextSibling);
        thisParent.insertBefore(this, dragSrcEl);

        addDragAndDropHandlers(dragSrcEl);
        addDragAndDropHandlers(this);
    }
}

function handleDragEnd(e) {
    checkIfSolved();
}

function initPuzzle(imagePath, size) {
    gridSize = size;
    puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    let pieces = [];
    let tempArray = [];

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.width = `${puzzleContainer.offsetWidth / gridSize}px`;
            piece.style.height = `${puzzleContainer.offsetHeight / gridSize}px`;
            piece.style.backgroundImage = `url('${imagePath}')`;
            piece.style.backgroundSize = `${puzzleContainer.offsetWidth}px ${puzzleContainer.offsetHeight}px`;
            piece.style.backgroundPosition = `-${j * (puzzleContainer.offsetWidth / gridSize)}px -${i * (puzzleContainer.offsetHeight / gridSize)}px`;
            tempArray.push(piece);
        }
    }

    // Shuffle array to randomize pieces
    while (tempArray.length) {
        const index = Math.floor(Math.random() * tempArray.length);
        pieces.push(tempArray.splice(index, 1)[0]);
    }

    pieces.forEach(piece => {
        puzzleContainer.appendChild(piece);
        addDragAndDropHandlers(piece);
    });
}

function checkIfSolved() {
    const pieces = Array.from(puzzleContainer.children);
    const isSolved = pieces.every((piece, index) => {
        const rect = piece.getBoundingClientRect();
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const expectedX = col * piece.offsetWidth;
        const expectedY = row * piece.offsetHeight;
        return rect.left - puzzleContainer.offsetLeft === expectedX && 
               rect.top - puzzleContainer.offsetTop === expectedY;
    });

    if (isSolved) {
        alert('拼图完成！恭喜！');
        document.getElementById('result-container').innerText = '收集成功！';
    }
}
