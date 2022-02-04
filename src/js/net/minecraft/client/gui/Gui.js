window.Gui = class {

    drawRect(stack, left, top, right, bottom, color, alpha = 1) {
        stack.save();
        stack.fillStyle = color;
        stack.globalAlpha = alpha;
        stack.fillRect(left, top, right - left, bottom - top);
        stack.restore();
    }

    drawCenteredString(stack, string, x, y, color = -1) {
        FontRenderer.INSTANCE.drawString(stack, string, x - this.getStringWidth(stack, string) / 2, y, color);
    }

    drawString(stack, string, x, y, color = -1) {
        FontRenderer.INSTANCE.drawString(stack, string, x, y, color);
    }

    getStringWidth(stack, string) {
        return FontRenderer.INSTANCE.getStringWidth(string);
    }

    drawTexture(stack, texture, x, y, width, height, alpha = 1.0) {
        Gui.drawSprite(stack, texture, 0, 0, 256, 256, x, y, width, height, alpha);
    }

    drawSprite(stack, texture, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height, alpha = 1.0) {
        Gui.drawSprite(stack, texture, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height, alpha);
    }

    drawBackground(stack, texture, width, height, scale = 2) {
        let pattern = stack.createPattern(texture, "repeat");
        stack.save();
        stack.filter = "brightness(50%)";
        stack.scale(scale, scale);
        stack.rect(0, 0, width / scale, height / scale);
        stack.fillStyle = pattern;
        stack.fill();
        stack.restore();
    }

    renderBlock(stack, texture, block, x, y) {
        stack.save();
        stack.translate(x + 3, y + 3);
        this.renderBlockFace(stack, texture, block, EnumBlockFace.NORTH);
        stack.restore();
    }

    renderBlockFace(stack, texture, block, face) {
        // UV Mapping
        let textureIndex = block.getTextureForFace(face);
        let minU = (textureIndex % 16) / 16.0;
        let minV = Math.floor(textureIndex / 16) / 16.0;

        stack.save();
        this.drawSprite(stack, texture, minU * 256, minV, 16, 16, 0, 0, 16, 16)

       // let triangles = IsometricRenderer.createTriangles(new Point(0, 0), new Point(1, 0), new Point(0, 1), new Point(1, 1));
      //  IsometricRenderer.render(stack, texture, triangles);

        stack.restore();
    }

    static drawSprite(stack, texture, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height, alpha = 1.0) {
        stack.save();
        stack.globalAlpha = alpha;
        stack.drawImage(texture, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height);
        stack.restore();
    }

    static loadTexture(path, callback) {
        let img = new Image();
        img.src = "src/resources/" + path;
        img.onload = callback;
        return img;
    }

}