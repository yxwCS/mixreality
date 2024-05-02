let dragSrcEl = null; // 用于存储正在拖动的元素
let gridSize; // 使网格大小在全局范围内可访问
let puzzleContainer; // 使拼图容器在全局范围内可访问

// 添加拖拽事件处理器到拼图块
function addDragAndDropHandlers(piece) {
    piece.addEventListener('dragstart', handleDragStart, false);
    piece.addEventListener('dragover', handleDragOver, false);
    piece.addEventListener('drop', handleDrop, false);
    piece.addEventListener('dragend', handleDragEnd, false);
}

// 处理拖动开始的事件
function handleDragStart(e) {
    dragSrcEl = this; // 存储拖拽源元素
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML); // 设置传输的数据类型和值
}

// 处理元素上方拖拽时的事件
function handleDragOver(e) {
    e.preventDefault(); // 阻止默认操作以允许放下
    e.dataTransfer.dropEffect = 'move'; // 设置拖放效果
    return false;
}

// 处理拖放事件
function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    if (dragSrcEl !== this) {
        const thisParent = this.parentNode;
        const dragSrcParent = dragSrcEl.parentNode;

        // 如果父节点不存在，就不执行交换
        if (!thisParent || !dragSrcParent) return;

        // Capture the nodes to replace
        const nextSibling = dragSrcEl.nextSibling === this ? dragSrcEl : dragSrcEl.nextSibling;

        // Swap elements
        thisParent.insertBefore(dragSrcEl, this);
        if (nextSibling) {
            dragSrcParent.insertBefore(this, nextSibling);
        } else {
            dragSrcParent.appendChild(this);
        }

        // Re-add event listeners
        addDragAndDropHandlers(dragSrcEl);
        addDragAndDropHandlers(this);
    }
}


// 处理拖拽结束的事件
function handleDragEnd(e) {
    checkIfSolved(); // 检查拼图是否已经完成
}

// 初始化拼图游戏
function initPuzzle(imagePath, gridSize) {
    gridSize = size;  // 设置网格大小
    puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = '';  // 清空旧的拼图块
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;  // 设置网格列

    const pieceWidth = puzzleContainer.offsetWidth / gridSize;
    const pieceHeight = puzzleContainer.offsetHeight / gridSize;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.width = `${pieceWidth}px`;
            piece.style.height = `${pieceHeight}px`;
            piece.style.backgroundImage = `url('${imagePath}')`;
            piece.style.backgroundSize = `${puzzleContainer.offsetWidth}px ${puzzleContainer.offsetHeight}px`;
            piece.style.backgroundPosition = `-${j * pieceWidth}px -${i * pieceHeight}px`;
            puzzleContainer.appendChild(piece);
            addDragAndDropHandlers(piece);
        }
    }
}

// 检查拼图是否完成
function checkIfSolved() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    const isSolved = Array.from(pieces).every((piece, index) => {
        const backgroundPos = piece.style.backgroundPosition.split(' ');
        const correctX = -(index % gridSize) * (puzzleContainer.offsetWidth / gridSize);
        const correctY = -Math.floor(index / gridSize) * (puzzleContainer.offsetHeight / gridSize);
        return parseInt(backgroundPos[0]) === correctX && parseInt(backgroundPos[1]) === correctY;
    });

    if (isSolved) {
        alert('拼图完成！恭喜！');
        document.getElementById('next-game').style.display = 'block'; // 显示前往下一个游戏的按钮
    }
}
