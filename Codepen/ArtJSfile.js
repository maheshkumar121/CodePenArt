let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  offsetX = 0;
  offsetY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

    const startEvent = isTouchDevice ? 'touchstart' : 'mousedown';
    const moveEvent = isTouchDevice ? 'touchmove' : 'mousemove';
    const endEvent = isTouchDevice ? 'touchend' : 'mouseup';

    document.addEventListener(moveEvent, (e) => {
      if (this.holdingPaper) {
        e.preventDefault();
        const pageX = isTouchDevice ? e.touches[0].pageX : e.pageX;
        const pageY = isTouchDevice ? e.touches[0].pageY : e.pageY;

        if (!this.rotating) {
          const deltaX = pageX - this.touchX;
          const deltaY = pageY - this.touchY;
          this.currentPaperX = this.offsetX + deltaX;
          this.currentPaperY = this.offsetY + deltaY;
        }

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener(startEvent, (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (isTouchDevice) {
        const touch = e.touches[0];
        this.touchX = touch.pageX;
        this.touchY = touch.pageY;
      } else {
        this.touchX = e.pageX;
        this.touchY = e.pageY;
      }

      this.offsetX = this.currentPaperX - this.touchX;
      this.offsetY = this.currentPaperY - this.touchY;

      if (e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener(endEvent, () => {
      this.holdingPaper = true;
      this.rotating = true;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
