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

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    dragSrcEl = this;
    this.style.opacity = '0.4';

    // 记录触摸起始点相对于元素左上角的偏移
    offsetX = touch.clientX - this.getBoundingClientRect().left;
    offsetY = touch.clientY - this.getBoundingClientRect().top;
}

function handleTouchMove(e) {
    e.preventDefault();  // 阻止屏幕滚动行为
    if (!dragSrcEl) return;
    const touch = e.touches[0];

    // 更新拼图块位置
    dragSrcEl.style.left = (touch.clientX - offsetX) + 'px';
    dragSrcEl.style.top = (touch.clientY - offsetY) + 'px';
}

function handleTouchEnd(e) {
    if (dragSrcEl) {
        dragSrcEl.style.opacity = '1.0';
    }
    dragSrcEl = null;  // 清除拖拽源元素引用
    checkIfSolved();  // 检查是否解决拼图
}

// 修改 handleDrop 函数以适应非触摸设备
function handleDrop(e) {
    if (dragSrcEl && dragSrcEl !== this) {
        // 交换位置逻辑可以保留，或根据需要修改
        const thisParent = this.parentNode;
        if (!thisParent) return;

        thisParent.insertBefore(dragSrcEl, this.nextSibling);
        thisParent.insertBefore(this, dragSrcEl);

        addDragAndDropHandlers(dragSrcEl);
        addDragAndDropHandlers(this);
    }
    if (dragSrcEl) {
        dragSrcEl.style.opacity = '1.0';
    }
    dragSrcEl = null;  // 清除拖拽源元素引用
    checkIfSolved();  // 检查是否解决拼图
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

function handleDragEnd(e) {
    if (e.type === 'touchend') {
        handleDrop(e.changedTouches[0]);
    }
    checkIfSolved();
}

function initPuzzle(imagePath, size, shuffleLevel = 1) {
    gridSize = size;
    puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    let pieces = [];
    let tempArray = [];
    let positionArray = [];

    // 初始化位置数组
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            positionArray.push({ row: i, col: j });
        }
    }

    // 创建拼图片段
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.width = `${puzzleContainer.offsetWidth / gridSize}px`;
            piece.style.height = `${puzzleContainer.offsetHeight / gridSize}px`;
            piece.style.backgroundImage = `url('${imagePath}')`;
            piece.style.backgroundSize = `${puzzleContainer.offsetWidth}px ${puzzleContainer.offsetHeight}px`;
            piece.style.backgroundPosition = `-${j * (puzzleContainer.offsetWidth / gridSize)}px -${i * (puzzleContainer.offsetHeight / gridSize)}px`;
            tempArray.push({ piece: piece, originalRow: i, originalCol: j });
        }
    }

    // 打乱片段
    tempArray.forEach(item => {
        let possiblePositions = positionArray.filter(pos => {
            return Math.abs(pos.row - item.originalRow) <= shuffleLevel && Math.abs(pos.col - item.originalCol) <= shuffleLevel;
        });
        if (possiblePositions.length) {
            const randIndex = Math.floor(Math.random() * possiblePositions.length);
            const position = possiblePositions.splice(randIndex, 1)[0];
            pieces.push({ piece: item.piece, row: position.row, col: position.col });
            positionArray = positionArray.filter(pos => pos !== position);
        }
    });

    // 将打乱后的片段添加到容器
    pieces.forEach(item => {
        item.piece.style.order = item.row * gridSize + item.col;
        puzzleContainer.appendChild(item.piece);
        addDragAndDropHandlers(item.piece);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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
        document.getElementById('result-container').innerText = '拼图成功！';
    }
}
