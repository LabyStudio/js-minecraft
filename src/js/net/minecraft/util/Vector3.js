export default class Vector3 {

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    addVector(x, y, z) {
        return new Vector3(this.x + x, this.y + y, this.z + z);
    }

    distanceTo(vec) {
        return Math.sqrt(this.squareDistanceTo(vec));
    }

    squareDistanceTo(vec) {
        let d0 = vec.x - this.x;
        let d1 = vec.y - this.y;
        let d2 = vec.z - this.z;
        return d0 * d0 + d1 * d1 + d2 * d2;
    }

    /**
     * Returns a new vector with x value equal to the second parameter, along the line between this vector and the
     * passed in vector, or null if not possible.
     */
    getIntermediateWithXValue(vec, x) {
        let d0 = vec.x - this.x;
        let d1 = vec.y - this.y;
        let d2 = vec.z - this.z;

        if (d0 * d0 < 1.0000000116860974E-7) {
            return null;
        } else {
            let d3 = (x - this.x) / d0;
            return d3 >= 0.0 && d3 <= 1.0 ? new Vector3(this.x + d0 * d3, this.y + d1 * d3, this.z + d2 * d3) : null;
        }
    }

    /**
     * Returns a new vector with y value equal to the second parameter, along the line between this vector and the
     * passed in vector, or null if not possible.
     */
    getIntermediateWithYValue(vec, y) {
        let d0 = vec.x - this.x;
        let d1 = vec.y - this.y;
        let d2 = vec.z - this.z;

        if (d1 * d1 < 1.0000000116860974E-7) {
            return null;
        } else {
            let d3 = (y - this.y) / d1;
            return d3 >= 0.0 && d3 <= 1.0 ? new Vector3(this.x + d0 * d3, this.y + d1 * d3, this.z + d2 * d3) : null;
        }
    }

    /**
     * Returns a new vector with z value equal to the second parameter, along the line between this vector and the
     * passed in vector, or null if not possible.
     */
    getIntermediateWithZValue(vec, z) {
        let d0 = vec.x - this.x;
        let d1 = vec.y - this.y;
        let d2 = vec.z - this.z;

        if (d2 * d2 < 1.0000000116860974E-7) {
            return null;
        } else {
            let d3 = (z - this.z) / d2;
            return d3 >= 0.0 && d3 <= 1.0 ? new Vector3(this.x + d0 * d3, this.y + d1 * d3, this.z + d2 * d3) : null;
        }
    }

    /**
     * Create an interpolated vector from the current vector position to the given one
     *
     * @param vector       The end vector
     * @param partialTicks Interpolation progress
     * @return Interpolated vector between the two positions
     */
    interpolateTo(vector, partialTicks) {
        let interpolatedX = this.x + (vector.x - this.x) * partialTicks;
        let interpolatedY = this.y + (vector.y - this.y) * partialTicks;
        let interpolatedZ = this.z + (vector.z - this.z) * partialTicks;

        return new Vector3(interpolatedX, interpolatedY, interpolatedZ);
    }

}