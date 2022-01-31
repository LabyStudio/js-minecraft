window.Keyboard = class {

    static state = {};

    static create() {
        window.addEventListener('keyup', (e) => Keyboard.state[e.code] = false);
        window.addEventListener('keydown', (e) => Keyboard.state[e.code] = true);
    };

    static isKeyDown(key) {
        return Keyboard.state[key];
    }

}