export default class Sound {

    constructor(name, pitch) {
        this.name = name;
        this.pitch = pitch;
    }

    getPlaceSound() {
        return "step." + this.name;
    }

    getBreakSound() {//currently only sand break sound is different to step sound
        return "break." + this.name;
    }

    getStepSound() {
        return "step." + this.name;
    }

    getPitch() {
        return this.pitch;
    }

}