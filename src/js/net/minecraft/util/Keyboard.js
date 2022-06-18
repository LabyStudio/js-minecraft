export default class Keyboard {

    static state = {};
    static enabled = false;

    static create() {
        window.addEventListener('keydown', event => {
            Keyboard.state[event.code] = true;
        });
        window.addEventListener('keyup', event => {
            event.preventDefault();
            delete Keyboard.state[event.code];
        });

        Keyboard.setEnabled(true);
    };

    static setState(key, state) {
        Keyboard.state[key] = state;
    }

    static unPressAll() {
        Keyboard.state = {};
    }

    static isKeyDown(key) {
        return Keyboard.state[key] && Keyboard.enabled;
    }

    static setEnabled(enabled) {
        Keyboard.enabled = enabled;

        if (!enabled) {
            Keyboard.unPressAll();
        }
    }

}