window.GuiKeyButton = class extends GuiButton {

    constructor(name, key, x, y, width, height, callback) {
        super(name + ": " + key, x, y, width, height, _ => callback(this.key));
        this.listening = false;
    }

    onPress() {
        this.listening = true;
        this.string = "...";
    }

    keyTyped(key) {
        if (this.listening) {
            this.string = name + ": " + key;
            this.listening = false;
            this.key = key;
            this.callback();
        }
    }
}