import Sound from "./Sound.js";

export default class SoundGlass extends Sound {

    constructor(name, pitch) {
        super(name, pitch);
    }

    getBreakSound() {
        return "random.glass";
    }

}