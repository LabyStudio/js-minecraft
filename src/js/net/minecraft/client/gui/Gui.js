window.Gui = class {

    drawRect(stack, left, top, right, bottom, color, alpha = 1) {
        stack.fillStyle = color;
        stack.globalAlpha = alpha;
        stack.fillRect(left, top, right - left, bottom - top);
        stack.globalAlpha = alpha;
    }

    drawTexture(stack, texture, x, y, width, height, alpha = 1.0) {
        this.drawSprite(stack, texture, 0, 0, 256, 256, x, y, width, height, alpha);
    }

    drawSprite(stack, texture, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height, alpha = 1.0) {
        stack.globalAlpha = alpha;
        stack.drawImage(texture, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height);
        stack.globalAlpha = 1.0;
    }

    loadTexture(path) {
        let img = new Image();
        img.src = path;
        return img;
    }

}