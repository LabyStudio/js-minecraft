import Gui from "../../gui/Gui.js";

export default class FontRenderer {

    static BITMAP_SIZE = 16;
    static FIELD_SIZE = 8;

    static COLOR_CODE_INDEX_LOOKUP = "0123456789abcdef";

    constructor(minecraft) {
        this.charWidths = [];

        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        this.texture = minecraft.resources["gui/font.png"];

        let bitMap = this.createBitMap(this.texture);

        // Calculate character width
        for (let i = 0; i < 256; i++) {
            this.charWidths[i] = this.calculateCharacterWidthAt(bitMap, i % FontRenderer.BITMAP_SIZE, Math.floor(i / FontRenderer.BITMAP_SIZE)) + 2;
        }
    }

    calculateCharacterWidthAt(bitMap, indexX, indexY) {
        // We scan the bitmap field from right to left
        for (let x = indexX * FontRenderer.FIELD_SIZE + FontRenderer.FIELD_SIZE - 1; x >= indexX * FontRenderer.FIELD_SIZE; x--) {

            // Scan this column from top to bottom
            for (let y = indexY * FontRenderer.FIELD_SIZE; y < indexY * FontRenderer.FIELD_SIZE + FontRenderer.FIELD_SIZE; y++) {

                let i = (x + y * this.texture.width) * 4;

                let red = bitMap[i];
                let green = bitMap[i + 1];
                let blue = bitMap[i + 2];
                let alpha = bitMap[i + 3];

                // Return width if there is a white pixel
                if (red > 1 || green > 1 || blue > 1 || alpha > 1) {
                    return x - indexX * FontRenderer.FIELD_SIZE;
                }
            }
        }

        // Empty field width (Could be a space character)
        return 2;
    }

    drawString(stack, string, x, y, color = -1) {
        if (!this.isSafari) { // TODO Fix brightness filter on Safari
            this.drawStringRaw(stack, string, x + 1, y + 1, (color & 0xFCFCFC) >> 2, true);
        }
        this.drawStringRaw(stack, string, x, y, color, false);
    }

    drawStringRaw(stack, string, x, y, color = -1, isShadow = true) {
        stack.save();

        if (isShadow) {
            stack.filter = "brightness(20%)";
        }

        // For each character
        for (let i = 0; i < string.length; i++) {
            let character = string[i];
            let code = string[i].charCodeAt(0);

            // Handle color codes if character is &
            if (character === '&' && i !== string.length - 1) {
                // Get the next character
                let nextCharacter = string[i + 1];

                // Change color of string
                //this.setColor(this.getColorOfCharacter(nextCharacter), isShadow);

                // Skip the color code for rendering
                i += 1;
                continue;
            }

            // Get character offset in bitmap
            let textureOffsetX = code % FontRenderer.BITMAP_SIZE * FontRenderer.FIELD_SIZE;
            let textureOffsetY = Math.floor(code / FontRenderer.BITMAP_SIZE) * FontRenderer.FIELD_SIZE;

            // Draw character
            Gui.drawSprite(
                stack,
                this.texture,
                textureOffsetX, textureOffsetY,
                FontRenderer.FIELD_SIZE, FontRenderer.FIELD_SIZE,
                Math.floor(x), Math.floor(y),
                FontRenderer.FIELD_SIZE, FontRenderer.FIELD_SIZE
            );

            // Increase drawing cursor
            x += this.charWidths[code];
        }

        stack.restore();
    }

    getColorOfCharacter(character) {
        let index = FontRenderer.COLOR_CODE_INDEX_LOOKUP.indexOf(character);
        let brightness = (index & 0x8) * 8;

        // Convert index to RGB
        let b = (index & 0x1) * 191 + brightness;
        let g = ((index & 0x2) >> 1) * 191 + brightness;
        let r = ((index & 0x4) >> 2) * 191 + brightness;

        return r << 16 | g << 8 | b;
    }

    getStringWidth(string) {
        let length = 0;

        // For each character
        for (let i = 0; i < string.length; i++) {

            // Check for color code
            if (string[i] === '&') {
                // Skip the next character
                i++;
            } else {
                // Add the width of the character
                let code = string[i].charCodeAt(0);
                length += this.charWidths[code];
            }
        }
        return length;
    }


    createBitMap(img) {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        return canvas.getContext('2d').getImageData(0, 0, img.width, img.height).data;
    }
}