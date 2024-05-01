document.addEventListener('DOMContentLoaded', function() {
    const puzzleContainer = document.getElementById('puzzle-container');
    const imgSrc = 'C:\\Users\\RecklessNoLove\\Desktop\\1.png'; // 替换成你的图片路径
    const gridSize = 4; // 4x4 的网格
    let emptyIndex = 15; // 初始空格位置

    function initPuzzle() {
        for (let i = 0; i < gridSize * gridSize; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            if (i === emptyIndex) {
                piece.classList.add('empty');
            } else {
                piece.style.backgroundImage = `url('${imgSrc}')`;
                const x = -(i % gridSize) * 100;
                const y = -Math.floor(i / gridSize) * 100;
                piece.style.backgroundPosition = `${x}px ${y}px`;
            }
            piece.addEventListener('click', () => movePiece(i));
            puzzleContainer.appendChild(piece);
        }
    }

    function movePiece(index) {
        const diff = Math.abs(index - emptyIndex);
        if (diff === 1 || diff === gridSize) {
            puzzleContainer.children[emptyIndex].style.backgroundImage =
                puzzleContainer.children[index].style.backgroundImage;
            puzzleContainer.children[emptyIndex].style.backgroundPosition =
                puzzleContainer.children[index].style.backgroundPosition;
            puzzleContainer.children[index].classList.add('empty');
            puzzleContainer.children[emptyIndex].classList.remove('empty');
            emptyIndex = index;
        }
    }

    initPuzzle();
});
