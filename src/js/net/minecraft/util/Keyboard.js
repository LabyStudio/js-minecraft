window.Keyboard = class {

    static state = {};

    static create() {
        window.addEventListener('keydown', function (event) {
            Keyboard.state[event.code] = true;
            //console.log("Key " + event.code + " down");
        });
        window.addEventListener('keyup', function (event) {
            delete Keyboard.state[event.code];
            //console.log("Key " + event.code + " up");
        });
    };

    static isKeyDown(key) {
        return Keyboard.state[key];
    }

}