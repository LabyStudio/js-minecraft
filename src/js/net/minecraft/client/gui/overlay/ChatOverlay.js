import Gui from "../Gui.js";
import ChatLine from "../../../util/ChatLine.js";
import GuiChat from "../screens/GuiChat.js";
import MathHelper from "../../../util/MathHelper.js";

export default class ChatOverlay extends Gui {

    constructor(minecraft) {
        super(minecraft);

        this.messages = [];
        this.sentHistory = [];
    }

    render(stack, mouseX, mouseY, partialTicks) {
        let chatOpen = this.minecraft.currentScreen instanceof GuiChat;

        for (let i = 0; i < this.messages.length; i++) {
            let message = this.messages[i];
            if (message.updateCounter >= 200 && !chatOpen) {
                continue;
            }

            let opacity = MathHelper.clamp((1.0 - message.updateCounter / 200) * 10, 0.0, 1.0);
            let alpha = Math.floor(255 * opacity * opacity);
            if (chatOpen) {
                alpha = 255;
            }

            if (alpha > 0) {
                let y = this.minecraft.window.height - 40 - i * 9;

                this.drawRect(stack, 2, y - 1, 2 + 320, y + 8, '#000000', alpha / 2 / 255);
                this.drawString(stack, message.message, 2, y, 0xffffff + (alpha << 24));
            }
        }
    }

    onTick() {
        for (let i = 0; i < this.messages.length; i++) {
            let message = this.messages[i];
            message.updateCounter++;
        }
    }

    addMessage(message) {
        this.messages.splice(0, 0, new ChatLine(message));
    }

    addMessageToSentHistory(message) {
        this.sentHistory.splice(0, 0, message);
    }

}