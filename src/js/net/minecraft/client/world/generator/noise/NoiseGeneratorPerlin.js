window.NoiseGeneratorPerlin = class extends NoiseGenerator {

    constructor(random) {
        super();

        this.permutations = [];
        for (let i = 0; i < 256; i++) {
            this.permutations[i] = i;
        }
        for (let i = 0; i < 256; i++) {
            let n = random.nextInt(256 - i) + i;
            let n2 = this.permutations[i];
            this.permutations[i] = this.permutations[n];
            this.permutations[n] = n2;
            this.permutations[i + 256] = this.permutations[i];
        }
    }

    fade(t) {
        // Fade function as defined by Ken Perlin.  This eases coordinate values
        // so that they will "ease" towards integral values.  This ends up smoothing
        // the final output.
        return t * t * t * (t * (t * 6 - 15) + 10);            // 6t^5 - 15t^4 + 10t^3
    }

    lerp(x, a, b) {
        return a + x * (b - a);
    }

    grad(hash, x, y, z) {
        let h = hash & 15;                                    // Take the hashed value and take the first 4 bits of it (15 == 0b1111)
        let u = h < 8 /* 0b1000 */ ? x : y;                // If the most significant bit (MSB) of the hash is 0 then set u = x.  Otherwise y.

        let v;                                             // In Ken Perlin's original implementation this was another conditional operator (?:).  I
        // expanded it for readability.
        if (h < 4 /* 0b0100 */)                                // If the first and second significant bits are 0 set v = y
            v = y;
        else if (h === 12 /* 0b1100 */ || h === 14 /* 0b1110*/)  // If the first and second significant bits are 1 set v = x
            v = x;
        else                                                  // If the first and second significant bits are not equal (0/1, 1/0) set v = z
            v = z;

        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v); // Use the last 2 bits to decide if u and v are positive or negative.  Then return their addition.
    }

    perlin(x, z) {
        let y;

        let xi = Math.floor(x) & 0xFF;
        let zi = Math.floor(z) & 0xFF;
        let yi = Math.floor(0.0) & 0xFF;

        x -= Math.floor(x);
        z -= Math.floor(z);
        y = 0.0 - Math.floor(0.0);

        let u = this.fade(x);
        let w = this.fade(z);
        let v = this.fade(y);

        let xzi = this.permutations[xi] + zi;
        let xzyi = this.permutations[xzi] + yi;

        xzi = this.permutations[xzi + 1] + yi;
        xi = this.permutations[xi + 1] + zi;
        zi = this.permutations[xi] + yi;
        xi = this.permutations[xi + 1] + yi;

        return this.lerp(v,
            this.lerp(w,
                this.lerp(u,
                    this.grad(this.permutations[xzyi], x, z, y),
                    this.grad(this.permutations[zi], x - 1.0, z, y)),
                this.lerp(u,
                    this.grad(this.permutations[xzi], x, z - 1.0, y),
                    this.grad(this.permutations[xi], x - 1.0, z - 1.0, y))),
            this.lerp(w,
                this.lerp(u,
                    this.grad(this.permutations[xzyi + 1], x, z, y - 1.0),
                    this.grad(this.permutations[zi + 1], x - 1.0, z, y - 1.0)),
                this.lerp(u,
                    this.grad(this.permutations[xzi + 1], x, z - 1.0, y - 1.0),
                    this.grad(this.permutations[xi + 1], x - 1.0, z - 1.0, y - 1.0))));
    }
}