import Sound from "./Sound.js";

export default class SoundGrass extends Sound {

    constructor(name, pitch) {
        super(name, pitch);
    }

    getBreakSound() {
        return "step.dirt";
    }

    getPlaceSound() {
        return "step.dirt";
    }

}