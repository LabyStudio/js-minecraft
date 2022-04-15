export default class Keyboard {

    static state = {};

    static create() {
        window.addEventListener('keydown', function (event) {
            Keyboard.state[event.code] = true;
        });
        window.addEventListener('keyup', function (event) {
            event.preventDefault();
            delete Keyboard.state[event.code];
        });
    };

    static setState(key, state) {
        Keyboard.state[key] = state;
    }

    static unPressAll() {
        Keyboard.state = {};
    }

    static isKeyDown(key) {
        return Keyboard.state[key];
    }

}