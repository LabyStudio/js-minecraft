import GuiScreen from "../GuiScreen.js";
import GuiTextField from "../widgets/GuiTextField.js";

export default class GuiChat extends GuiScreen {

    constructor() {
        super();

        this.inputField = new GuiTextField(0, 0, 0, 0);
        this.inputField.renderBackground = false;

        this.historyIndex = -1;
    }

    init() {
        super.init();

        this.inputField.x = 2;
        this.inputField.y = this.height - 14;
        this.inputField.width = this.width - 4;
        this.inputField.height = 12;
        this.inputField.isFocused = true;

        this.buttonList.push(this.inputField);
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        this.drawRect(stack, 2, this.height - 14, this.width - 2, this.height - 2, '#000000', 0.5);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

    keyTyped(key, character) {
        if (key === "Enter") {
            let message = this.inputField.getText().trim();
            if (message.length === 0) {
                return;
            }

            // Close screen
            this.minecraft.displayScreen(null);

            // Add message to sent history
            this.minecraft.ingameOverlay.chatOverlay.addMessageToSentHistory(message);
            this.minecraft.playerController.sendChatMessage(message);
            return;
        }

        if (key === "ArrowUp" || key === "ArrowDown") {
            let up = key === "ArrowUp";
            let history = this.minecraft.ingameOverlay.chatOverlay.sentHistory;

            if (up) {
                if (this.historyIndex + 1 < history.length) {
                    this.historyIndex++;
                }
            } else {
                if (this.historyIndex >= 0) {
                    this.historyIndex--;
                }
            }

            this.inputField.text = this.historyIndex < 0 ? "" : history[this.historyIndex];
            return;
        }

        return super.keyTyped(key, character);
    }

}