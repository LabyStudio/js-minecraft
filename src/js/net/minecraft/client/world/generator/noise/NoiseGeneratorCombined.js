window.NoiseGeneratorCombined = class extends NoiseGenerator {

    constructor(firstGenerator, secondGenerator) {
        super();

        this.firstGenerator = firstGenerator;
        this.secondGenerator = secondGenerator;
    }

    perlin(x, z) {
        return this.firstGenerator.perlin(x + this.secondGenerator.perlin(x, z), z);
    }

}