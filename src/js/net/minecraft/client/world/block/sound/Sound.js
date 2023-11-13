export default class Sound {

    constructor(name, pitch) {
        this.name = name;
        this.pitch = pitch;
    }

    getPlaceSound() {
        return "step." + this.name;
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