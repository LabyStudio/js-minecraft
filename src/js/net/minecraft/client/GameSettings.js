window.GameSettings = class {

    constructor() {
        this.crouching = 'ShiftLeft';
        this.sprinting = 'ControlLeft';
        this.togglePerspective =  'F5';
        this.thirdPersonView = 0;
    }

    load() {
        for (let prop in this) {
            let nameEQ = prop + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    this[prop] = c.substring(nameEQ.length, c.length);
                }
            }
        }
    }

    save() {
        for (let prop in this) {
            document.cookie = prop + "=" + (this[prop] || "") + "; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        }
    }

}