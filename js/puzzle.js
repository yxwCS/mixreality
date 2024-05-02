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
    e.stopPropagation(); // 停止事件冒泡
    e.preventDefault();
    if (dragSrcEl !== this) {
        let draggedHTML = dragSrcEl.outerHTML;
        let thisHTML = this.outerHTML;
        dragSrcEl.outerHTML = thisHTML;
        this.outerHTML = draggedHTML;

        // 重新添加事件监听器，因为 outerHTML 替换会移除之前的事件监听器
        addDragAndDropHandlers(dragSrcEl);
        addDragAndDropHandlers(this);
    }
    return false;
}

// 处理拖拽结束的事件
function handleDragEnd(e) {
    checkIfSolved(); // 检查拼图是否已经完成
}

// 初始化拼图游戏
function initPuzzle(imagePath, size) {
    gridSize = size;
    puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; // 设置网格列

    let pieces = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        pieces.push(i);
    }
    pieces.sort(() => Math.random() - 0.5); // 打乱顺序

    for (let i = 0; i < pieces.length; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.width = `${puzzleContainer.offsetWidth / gridSize}px`;
        piece.style.height = `${puzzleContainer.offsetHeight / gridSize}px`;
        piece.style.backgroundImage = `url('${imagePath}')`;
        const x = -(i % gridSize) * (puzzleContainer.offsetWidth / gridSize);
        const y = -Math.floor(i / gridSize) * (puzzleContainer.offsetHeight / gridSize);
        piece.style.backgroundPosition = `${x}px ${y}px`;
        puzzleContainer.appendChild(piece);
        addDragAndDropHandlers(piece);
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
