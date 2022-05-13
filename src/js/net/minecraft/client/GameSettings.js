export default class GameSettings {

    constructor() {
        this.crouching = 'ShiftLeft';
        this.sprinting = 'ControlLeft';
        this.togglePerspective = 'F5';
        this.thirdPersonView = 0;
        this.fov = 70;
        this.viewBobbing = true;
        this.ambientOcclusion = true;
        this.sensitivity = 100;
        this.viewDistance = 4;
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