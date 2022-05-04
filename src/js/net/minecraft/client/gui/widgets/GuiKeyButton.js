import GuiButton from "./GuiButton.js";

export default class GuiKeyButton extends GuiButton {

    constructor(name, key, x, y, width, height, callback) {
        super(name + ": " + key, x, y, width, height, _ => callback(this.key));

        this.name = name;
        this.listening = false;
    }

    onPress() {
        this.listening = true;
        this.string = "...";
    }

    keyTyped(key) {
        if (this.listening) {
            this.string = this.name + ": " + key;
            this.listening = false;
            this.key = key;
            this.callback();
        }
    }
}