let dragSrcEl = null;
let gridSize;
let puzzleContainer;

function addDragAndDropHandlers(piece) {
    // 添加触摸事件
    piece.addEventListener('touchstart', handleDragStart, false);
    piece.addEventListener('touchmove', handleTouchMove, false);
    piece.addEventListener('touchend', handleDragEnd, false);

    // 原有的鼠标事件
    piece.addEventListener('dragstart', handleDragStart, false);
    piece.addEventListener('dragover', handleDragOver, false);
    piece.addEventListener('drop', handleDrop, false);
    piece.addEventListener('dragend', handleDragEnd, false);
}

function handleDragStart(e) {
    dragSrcEl = this;
    if (e.type === 'touchstart') {
        var touch = e.touches[0];
        e.dataTransfer = {
            setData: function(type, val) {
                e.dataTransfer[type] = val;
            },
            dropEffect: 'move',
            effectAllowed: 'move'
        };
        e.dataTransfer.setData('text/html', this.outerHTML);
    } else {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    }
}

function handleTouchMove(e) {
    e.preventDefault(); // 防止滚动屏幕
    if (e.touches.length == 1) {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target !== dragSrcEl) {
            handleDrop({ target: target, preventDefault: () => {}, stopPropagation: () => {} });
        }
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target || e; // 兼容触摸事件中的调用
    if (dragSrcEl !== target) {
        const thisParent = target.parentNode;
        if (!thisParent) return;

        // 交换元素
        thisParent.insertBefore(dragSrcEl, target.nextSibling);
        thisParent.insertBefore(target, dragSrcEl);

        addDragAndDropHandlers(dragSrcEl);
        addDragAndDropHandlers(target);
    }
}

function handleDragEnd(e) {
    if (e.type === 'touchend') {
        handleDrop(e.changedTouches[0]);
    }
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

    // 打乱数组以随机化片段
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
    const tolerance = 1; // 可以根据需要调整容忍范围
    const pieces = Array.from(puzzleContainer.children);
    const isSolved = pieces.every((piece, index) => {
        const rect = piece.getBoundingClientRect();
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const expectedX = col * piece.offsetWidth;
        const expectedY = row * piece.offsetHeight;
        
        const deltaX = Math.abs(rect.left - puzzleContainer.offsetLeft - expectedX);
        const deltaY = Math.abs(rect.top - puzzleContainer.offsetTop - expectedY);

        return deltaX <= tolerance && deltaY <= tolerance;
    });

    if (isSolved) {
        alert('拼图完成！恭喜！');
        document.getElementById('result-container').innerText = '拼图成功！';
    }
}

