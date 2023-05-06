let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

    const startEvent = isTouchDevice ? 'touchstart' : 'mousedown';
    const moveEvent = isTouchDevice ? 'touchmove' : 'mousemove';
    const endEvent = isTouchDevice ? 'touchend' : 'mouseup';

    const getTouchCoordinates = (event) => {
      const touches = event.touches || event.targetTouches;
      return {
        x: touches[0].clientX,
        y: touches[0].clientY
      };
    };

    document.addEventListener(moveEvent, (e) => {
      if (!this.rotating) {
        this.mouseX = isTouchDevice ? getTouchCoordinates(e).x : e.clientX;
        this.mouseY = isTouchDevice ? getTouchCoordinates(e).y : e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = this.mouseX - this.touchX;
      const dirY = this.mouseY - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener(startEvent, (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (isTouchDevice) {
        const touch = getTouchCoordinates(e);
        this.touchX = touch.x;
        this.touchY = touch.y;
        this.prevTouchX = this.touchX;
        this.prevTouchY = this.touchY;
      } else {
        this.touchX = e.clientX;
        this.touchY = e.clientY;
        this.prevMouseX = this.touchX;
        this.prevMouseY = this.touchY;
      }

      if (e.touches && e.touches.length === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener(endEvent, () => {
      this.holdingPaper =false;
this.rotating = false;
});
