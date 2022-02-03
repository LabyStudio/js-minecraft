window.Gui = class {

    drawRect(stack, left, top, right, bottom, color, alpha = 1) {
        stack.save();
        stack.fillStyle = color;
        stack.globalAlpha = alpha;
        stack.fillRect(left, top, right - left, bottom - top);
        stack.restore();
    }

    drawString(stack, string, x, y, color) {
        this._drawString(stack, string, x, y, color, 0, false);
    }

    _drawString(stack, string, x, y, color, alignment, bold) {
        let size = 24;
        stack.font = (bold ? "bold" : "normal") + " " + size + "px Minecraftia";
        stack.fillStyle = color;
        stack.textAlign = alignment === 0 ? "center" : alignment < 0 ? "left" : "right";
        stack.fillText(string, x, y);
    }

    drawTexture(stack, texture, x, y, width, height, alpha = 1.0) {
        this.drawSprite(stack, texture, 0, 0, 256, 256, x, y, width, height, alpha);
    }

    drawSprite(stack, texture, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height, alpha = 1.0) {
        stack.save();
        stack.globalAlpha = alpha;
        stack.drawImage(texture, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height);
        stack.restore();
    }

    drawBackground(stack, texture, width, height, scale = 8) {
        let pattern = stack.createPattern(texture, "repeat");
        stack.save();
        stack.filter = "brightness(50%)";
        stack.scale(scale, scale);
        stack.rect(0, 0, width / scale, height / scale);
        stack.fillStyle = pattern;
        stack.fill();
        stack.restore();
    }

    loadTexture(path) {
        let img = new Image();
        img.src = path;
        return img;
    }

}