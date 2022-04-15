import NoiseGenerator from "../NoiseGenerator.js";
import NoiseGeneratorPerlin from "./NoiseGeneratorPerlin.js";

export default class NoiseGeneratorOctaves extends NoiseGenerator {

    constructor(random, octaves) {
        super();

        this.octaves = octaves;
        this.generatorCollection = [];

        for (let i = 0; i < octaves; i++) {
            this.generatorCollection[i] = new NoiseGeneratorPerlin(random);
        }
    }

    perlin(x, z) {
        let total = 0.0;
        let frequency = 1.0;
        for (let i = 0; i < this.octaves; i++) {
            total += this.generatorCollection[i].perlin(x / frequency, z / frequency) * frequency;
            frequency *= 2.0;
        }
        return total;
    }

}