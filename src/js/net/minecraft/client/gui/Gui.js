import Point from "../render/isometric/Point.js";
import IsometricRenderer from "../render/isometric/IsometricRenderer.js";
import EnumBlockFace from "../../util/EnumBlockFace.js";

export default class Gui {

    constructor(minecraft = null) {
        this.minecraft = minecraft;
    }

    getTexture(id) {
        return this.minecraft.resources[id];
    }

    drawCenteredString(stack, string, x, y, color = -1) {
        this.minecraft.fontRenderer.drawString(stack, string, x - this.getStringWidth(stack, string) / 2, y, color);
    }

    drawRightString(stack, string, x, y, color = -1, shadow = true) {
        this.minecraft.fontRenderer.drawString(stack, string, x - this.getStringWidth(stack, string), y, color, shadow);
    }

    drawString(stack, string, x, y, color = -1, shadow = true) {
        this.minecraft.fontRenderer.drawString(stack, string, x, y, color, shadow);
    }

    getStringWidth(stack, string) {
        return this.minecraft.fontRenderer.getStringWidth(string);
    }

    drawRect(stack, left, top, right, bottom, color, alpha = 1) {
        stack.save();
        stack.fillStyle = color;
        stack.globalAlpha = alpha;
        stack.fillRect(Math.floor(left), Math.floor(top), Math.floor(right - left), Math.floor(bottom - top));
        stack.restore();
    }

    drawGradientRect(stack, left, top, right, bottom, color1, color2) {
        let gradient = stack.createLinearGradient(left + (right - left) / 2, top, left + (right - left) / 2, bottom - top);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        stack.fillStyle = gradient;
        stack.fillRect(left, top, right - left, bottom - top);
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
        stack.filter = "brightness(28%)";
        stack.scale(scale, scale);
        stack.rect(0, 0, width / scale, height / scale);
        stack.fillStyle = pattern;
        stack.fill();
        stack.restore();
    }

    renderBlock(stack, texture, block, x, y) {
        let scale = 0.18;

        let blockWidth = 32 * scale;

        let sideY = 16 * scale;
        let sideHeight = 40 * scale;
        let middleTopHeight = 32 * scale;
        let middleBottomHeight = 40 * scale;

        let topTip = new Point(0, -middleTopHeight);
        let center = new Point(0, 0);
        let bottomTip = new Point(0, middleBottomHeight);

        let topLeft = new Point(-blockWidth, -middleTopHeight + sideY);
        let bottomLeft = new Point(-blockWidth, -middleTopHeight + sideY + sideHeight);

        let topRight = new Point(blockWidth, -middleTopHeight + sideY);
        let bottomRight = new Point(blockWidth, -middleTopHeight + sideY + sideHeight);

        let trianglesLeft = IsometricRenderer.createTriangles(
            texture,
            topLeft,
            center,
            bottomTip,
            bottomLeft
        );

        let trianglesRight = IsometricRenderer.createTriangles(
            texture,
            center,
            topRight,
            bottomRight,
            bottomTip
        );

        let trianglesTop = IsometricRenderer.createTriangles(
            texture,
            topLeft,
            topTip,
            topRight,
            center
        );

        stack.save();
        stack.translate(x + 0.5, y + 0.5);
        stack.imageSmoothingEnabled = true;
        this.renderBlockFace(stack, texture, block, trianglesLeft, EnumBlockFace.NORTH);
        this.renderBlockFace(stack, texture, block, trianglesRight, EnumBlockFace.EAST);
        this.renderBlockFace(stack, texture, block, trianglesTop, EnumBlockFace.TOP);
        stack.restore();
    }

    renderBlockFace(stack, texture, block, triangles, face) {
        // UV Mapping
        let textureIndex = block.getTextureForFace(face);
        let minU = (textureIndex % 16) / 16.0;
        let minV = Math.floor(textureIndex / 16) / 16.0;

        stack.save();
        IsometricRenderer.render(stack, triangles, _ => this.drawSprite(stack, texture, minU * 256, minV, 16, 16, 0, 0, 256, 256));
        stack.restore();
    }

    static drawSprite(stack, texture, spriteX, spriteY, spriteWidth, spriteHeight, x, y, width, height, alpha = 1.0) {
        stack.save();
        stack.globalAlpha = alpha;
        stack.drawImage(
            texture,
            Math.floor(spriteX),
            Math.floor(spriteY),
            Math.floor(spriteWidth),
            Math.floor(spriteHeight),
            Math.floor(x),
            Math.floor(y),
            Math.floor(width),
            Math.floor(height)
        );
        stack.restore();
    }
}