import GuiButton from "./GuiButton.js";

export default class GuiTextField extends GuiButton {

    constructor(x, y, width, height) {
        super("", x, y, width, height);

        this.text = "";
        this.isFocused = false;
        this.cursorCounter = 0;
        this.maxLength = 80;
        this.renderBackground = true;
    }

    render(stack, mouseX, mouseY, partialTicks) {
        let cursorVisible = this.isFocused && Math.floor(this.cursorCounter / 6) % 2 === 0;
        let textColor = this.enabled ? 0xe0e0e0ff : 0x707070ff;

        // Draw background
        if (this.renderBackground) {
            this.drawRect(stack, this.x - 1, this.y - 1, this.x + this.width + 1, this.y + this.height + 1, '#5f5f60');
            this.drawRect(stack, this.x, this.y, this.x + this.width, this.y + this.height, 'black');
        }

        // Draw text
        this.drawString(stack, this.text, this.x + 2, this.y + this.height / 2 - 4, textColor);

        // Draw cursor
        if (cursorVisible) {
            this.drawString(stack, "_", this.x + 2 + this.getStringWidth(stack, this.text), this.y + this.height / 2 - 4, textColor);
        }
    }

    onTick() {
        this.cursorCounter++;
    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        this.isFocused = true;
    }

    onPress() {

    }

    keyTyped(key, character) {
        if (!this.isFocused || !this.enabled) {
            return;
        }

        if (key === "Backspace") {
            if (this.text.length > 0) {
                this.text = this.text.substring(0, this.text.length - 1);
            }
            return;
        }

        if (key === "ShiftLeft") {
            this.shiftPressed = true;
            return;
        }

        if (key === "ControlLeft") {
            this.controlPressed = true;
            return;
        }

        if (key === "KeyV" && this.controlPressed) {
            this.minecraft.window.getClipboardText().then(text => {
                this.text += text;
            });
            return;
        }

        if (key === "KeyA" && this.controlPressed) {
            this.text = ""; // TODO: Select all
            return;
        }

        if (character.length !== 1) {
            return;
        }

        if (this.text.length < this.maxLength) {
            this.text += character;
        }
    }

    keyReleased(key) {
        if (key === "ShiftLeft") {
            this.shiftPressed = false;
            return;
        }

        if (key === "ControlLeft") {
            this.controlPressed = false;
            return;
        }
    }

    getText() {
        return this.text;
    }
}