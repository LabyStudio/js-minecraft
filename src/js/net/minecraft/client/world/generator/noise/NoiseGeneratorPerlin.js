import NoiseGenerator from "../NoiseGenerator.js";

export default class NoiseGeneratorPerlin extends NoiseGenerator {

    constructor(random) {
        super();

        this.offsetX = random.nextDouble() * 256;
        this.offsetY = random.nextDouble() * 256;
        this.offsetZ = random.nextDouble() * 256;

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
        return this.perlinXYZ(x, z, 0);
    }

    perlinXYZ(x, y, z) {
        let shiftX = x + this.offsetX;
        let shiftY = y + this.offsetY;
        let shiftZ = z + this.offsetZ;

        let floorX = Math.floor(shiftX);
        let floorY = Math.floor(shiftY);
        let floorZ = Math.floor(shiftZ);

        if (shiftX < floorX) {
            floorX--;
        }
        if (shiftY < floorY) {
            floorY--;
        }
        if (shiftZ < floorZ) {
            floorZ--;
        }

        let x1 = floorX & 0xff;
        let y1 = floorY & 0xff;
        let z1 = floorZ & 0xff;

        shiftX -= floorX;
        shiftY -= floorY;
        shiftZ -= floorZ;

        let u = this.fade(shiftX);
        let w = this.fade(shiftY);
        let v = this.fade(shiftZ);

        let xy = this.permutations[x1] + y1;
        let xyz = this.permutations[xy] + z1;

        let xy1z = this.permutations[xy + 1] + z1;
        let xi = this.permutations[x1 + 1] + y1;
        let yi = this.permutations[xi] + z1;
        let zi = this.permutations[xi + 1] + z1;

        return this.lerp(v,
            this.lerp(w,
                this.lerp(u,
                    this.grad(this.permutations[xyz], shiftX, shiftY, shiftZ),
                    this.grad(this.permutations[yi], shiftX - 1.0, shiftY, shiftZ)),
                this.lerp(u,
                    this.grad(this.permutations[xy1z], shiftX, shiftY - 1.0, shiftZ),
                    this.grad(this.permutations[zi], shiftX - 1.0, shiftY - 1.0, shiftZ))),
            this.lerp(w,
                this.lerp(u,
                    this.grad(this.permutations[xyz + 1], shiftX, shiftY, shiftZ - 1.0),
                    this.grad(this.permutations[yi + 1], shiftX - 1.0, shiftY, shiftZ - 1.0)),
                this.lerp(u,
                    this.grad(this.permutations[xy1z + 1], shiftX, shiftY - 1.0, shiftZ - 1.0),
                    this.grad(this.permutations[zi + 1], shiftX - 1.0, shiftY - 1.0, shiftZ - 1.0))));
    }

    combined(noise, x1, y1, z1, x2, y2, z2, strengthX, strengthY, strengthZ, frequency) {
        let index = 0;
        let invertFrequency = 1.0 / frequency;
        let prevY3 = -1;

        // Output values
        let output1 = 0;
        let output2 = 0;
        let output3 = 0;
        let output4 = 0;

        // X loop
        for (let x = 0; x < x2; x++) {
            let shiftX = (x1 + x) * strengthX + this.offsetX;
            let floorX = Math.floor(shiftX);

            if (shiftX < floorX) {
                floorX--;
            }

            let x3 = floorX & 0xff;
            shiftX -= floorX;

            // Z loop
            let u = this.fade(shiftX);
            for (let z = 0; z < z2; z++) {
                let shiftZ = (z1 + z) * strengthZ + this.offsetZ;
                let floorZ = Math.floor(shiftZ);

                if (shiftZ < floorZ) {
                    floorZ--;
                }

                let z3 = floorZ & 0xff;
                shiftZ -= floorZ;

                // Y loop
                let w = this.fade(shiftZ);
                for (let y = 0; y < y2; y++) {
                    let shiftY = (y1 + y) * strengthY + this.offsetY;
                    let floorY = Math.floor(shiftY);

                    if (shiftY < floorY) {
                        floorY--;
                    }

                    let y3 = floorY & 0xff;
                    shiftY -= floorY;

                    let v = this.fade(shiftY);

                    // Check if y changed
                    if (y === 0 || y3 !== prevY3) {
                        prevY3 = y3;

                        let xy = this.permutations[x3] + y3;
                        let xyz = this.permutations[xy] + z3;

                        let xy1z = this.permutations[xy + 1] + z3;
                        let xi = this.permutations[x3 + 1] + y3;
                        let yi = this.permutations[xi] + z3;
                        let zi = this.permutations[xi + 1] + z3;

                        output1 = this.lerp(u,
                            this.grad(this.permutations[xyz], shiftX, shiftY, shiftZ),
                            this.grad(this.permutations[yi], shiftX - 1.0, shiftY, shiftZ));
                        output2 = this.lerp(u,
                            this.grad(this.permutations[xy1z], shiftX, shiftY - 1.0, shiftZ),
                            this.grad(this.permutations[zi], shiftX - 1.0, shiftY - 1.0, shiftZ));
                        output3 = this.lerp(u,
                            this.grad(this.permutations[xyz + 1], shiftX, shiftY, shiftZ - 1.0),
                            this.grad(this.permutations[yi + 1], shiftX - 1.0, shiftY, shiftZ - 1.0));
                        output4 = this.lerp(u,
                            this.grad(this.permutations[xy1z + 1], shiftX, shiftY - 1.0, shiftZ - 1.0),
                            this.grad(this.permutations[zi + 1], shiftX - 1.0, shiftY - 1.0, shiftZ - 1.0));
                    }

                    let output5 = this.lerp(v, output1, output2);
                    let output6 = this.lerp(v, output3, output4);

                    // Add final output to noise array
                    let output = this.lerp(w, output5, output6);
                    noise[index++] += output * invertFrequency;
                }
            }
        }
    }
}