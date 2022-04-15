export default class Sound {

    constructor(name, pitch) {
        this.name = name;
        this.pitch = pitch;
    }

    getBreakSound() {
        return "step." + this.name;
    }

    getStepSound() {
        return "step." + this.name;
    }

    getPitch() {
        return this.pitch;
    }

}