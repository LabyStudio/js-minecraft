window.Keyboard = class {

    static state = {};

    static create() {
        window.addEventListener('keydown', function (event) {
            //event.preventDefault();
            Keyboard.state[event.code] = true;
            //console.log("Key " + event.code + " down");
        });
        window.addEventListener('keyup', function (event) {
            event.preventDefault();
            delete Keyboard.state[event.code];
            //console.log("Key " + event.code + " up");
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