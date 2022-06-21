export default class GameSettings {

    constructor() {
        this.keyCrouching = 'ShiftLeft';
        this.keySprinting = 'ControlLeft';
        this.keyTogglePerspective = 'F5';
        this.keyOpenChat = 'KeyT';
        this.keyOpenInventory = 'KeyE';
        this.keyPlayerList = 'Tab';

        this.session = null;

        this.thirdPersonView = 0;
        this.fov = 70;
        this.viewBobbing = true;
        this.ambientOcclusion = true;
        this.sensitivity = 100;
        this.viewDistance = 4;
        this.debugOverlay = false;
        this.serverAddress = 'server.labystudio.de';
    }

    load() {
        for (let prop in this) {
            let nameEQ = prop + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    let value = c.substring(nameEQ.length, c.length);
                    if (value.match(/^[0-9]+$/)) {
                        value = parseInt(value);
                    }
                    if (value === 'true') {
                        value = true;
                    }
                    if (value === 'false') {
                        value = false;
                    }
                    if (value === 'null') {
                        value = null;
                    }
                    this[prop] = value;
                }
            }
        }
    }

    save() {
        for (let prop in this) {
            document.cookie = prop + "=" + this[prop] + "; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        }
    }

}