import Gui from "../../gui/Gui.js";
import MathHelper from "../../../util/MathHelper.js";

export default class FontRenderer {

    static FONT_HEIGHT = 9;

    static BITMAP_SIZE = 16;
    static FIELD_SIZE = 8;

    static COLOR_CODE_INDEX_LOOKUP = "0123456789abcdef";
    static CHAR_INDEX_LOOKUP = "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000";
    static COLOR_PREFIX = '\u00a7';

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

    drawString(stack, string, x, y, color = -1, shadow = true) {
        if (!this.isSafari && shadow) { // TODO Fix filter on Safari
            this.drawStringRaw(stack, string, x + 1, y + 1, color, true);
        }
        this.drawStringRaw(stack, string, x, y, color);
    }

    drawStringRaw(stack, string, x, y, color = -1, isShadow = false) {
        stack.save();

        // Set color
        if (color !== -1 || isShadow) {
            this.setColor(stack, color, isShadow);
        }

        let alpha = ((color & 0xFF000000) >>> 24) / 255;

        // For each character
        for (let i = 0; i < string.length; i++) {
            let character = string[i];
            let index = FontRenderer.CHAR_INDEX_LOOKUP.indexOf(character);
            let code = character.charCodeAt(0);

            // Handle color codes if character is &
            if (character === FontRenderer.COLOR_PREFIX && i !== string.length - 1) {
                // Get the next character
                let nextCharacter = string[i + 1];

                // Change color of string
                this.setColor(stack, this.getColorOfCharacter(nextCharacter), isShadow);

                // Skip the color code for rendering
                i += 1;
                continue;
            }

            // Get character offset in bitmap
            let textureOffsetX = index % FontRenderer.BITMAP_SIZE * FontRenderer.FIELD_SIZE;
            let textureOffsetY = Math.floor(index / FontRenderer.BITMAP_SIZE) * FontRenderer.FIELD_SIZE;

            // Draw character
            Gui.drawSprite(
                stack,
                this.texture,
                textureOffsetX, textureOffsetY,
                FontRenderer.FIELD_SIZE, FontRenderer.FIELD_SIZE,
                Math.floor(x), Math.floor(y),
                FontRenderer.FIELD_SIZE, FontRenderer.FIELD_SIZE,
                alpha
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
            if (string[i] === FontRenderer.COLOR_PREFIX) {
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

    setColor(stack, color, isShadow = false) {
        if (isShadow) {
            color = (color & 0xFCFCFC) >> 2;
        }

        let r = (color & 0xFF0000) >> 16;
        let g = (color & 0x00FF00) >> 8;
        let b = (color & 0x0000FF);
        let hsv = MathHelper.rgb2hsv(r, g, b);
        let hue = hsv[0] + 270;
        let saturation = hsv[1];
        let brightness = hsv[2] / 255 * 100;

        // TODO fix colors
        let saturate1 = saturation * 1000;
        let saturate2 = saturation * 5000;
        let saturate3 = saturation * 100;

        if (!this.isSafari) { // TODO Fix filter on Safari
            stack.filter = "sepia()"
                + " saturate(" + saturate1 + "%)"
                + " hue-rotate(" + hue + "deg)"
                + " saturate(" + saturate2 + "%)"
                + " brightness(" + brightness + "%)"
                + " saturate(" + saturate3 + "%)";
        }
    }

    listFormattedStringToWidth(text, wrapWidth) {
        return text.split("\n"); // TODO Implement wrap logic
    }
}