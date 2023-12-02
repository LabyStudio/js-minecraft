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
    globalEval(src) {
        var fn = function() {
            window.eval.call(window,src);
        };
        fn();
    };
    
    keyTyped(key, character) {
        if (key === "Enter") {
            let message = this.inputField.getText().trim();
            if (message.length === 0) {
                return;
            }
            let splitmessage=message.replaceAll(/\s+/g, '\x01').split('\x01');
            if(blocklyFunctions?.includes(splitmessage[0])) {
                let blocklycodepre = `
                var globfn={};//only use this in main.js in order to use multiple parallel asynch executed functions we might need an array, we can reuse the array if is_script_ended is true
                //also we should have globfn array to handle entities such as block that behaves like an animal
                //or at least we should store the current globfn in a variable that belongs to entity
                is_script_ended++;
                `;
                let code=blocklycode;
                code+=`
                is_script_ended++;
                (
               
                    async () => {
                        try{
                            await globfn.a(`+splitmessage.slice(1).join(',')+`);
                        }catch{}
                    })();
                is_script_ended--;`
        
                console.log(code);
                this.globalEval(code);
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