window.MathHelper = class {

    /**
     * Returns the greatest integer less than or equal to the double argument
     */
    static floor_double(value) {
        let i = parseInt(value);
        return value < i ? i - 1 : i;
    }

    static toDegrees(angle) {
        return angle * (180 / Math.PI);
    }

    static toRadians(degree) {
        return degree * (Math.PI / 180);
    };

}