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

    static calculateCelestialAngle(time, partialTicks) {
        let modTime = (time % 24000);
        let angle = (modTime + partialTicks) / 24000.0 - 0.25;

        if (angle < 0.0) {
            angle++;
        }
        if (angle > 1.0) {
            angle--;
        }

        angle = 1.0 - ((Math.cos(angle * Math.PI) + 1.0) / 2.0);
        angle = angle + (angle - angle) / 3.0;

        return angle;
    }

    static hsbToRgb(hue, saturation, brightness) {
        let r = 0, g = 0, b = 0;
        if (saturation === 0) {
            r = g = b = Math.floor(brightness * 255.0 + 0.5);
        } else {
            let h = (hue - Math.floor(hue)) * 6.0;
            let f = h - Math.floor(h);
            let p = brightness * (1.0 - saturation);
            let q = brightness * (1.0 - saturation * f);
            let t = brightness * (1.0 - (saturation * (1.0 - f)));
            switch (Math.floor(h)) {
                case 0:
                    r = Math.floor(brightness * 255.0 + 0.5);
                    g = Math.floor(t * 255.0 + 0.5);
                    b = Math.floor(p * 255.0 + 0.5);
                    break;
                case 1:
                    r = Math.floor(q * 255.0 + 0.5);
                    g = Math.floor(brightness * 255.0 + 0.5);
                    b = Math.floor(p * 255.0 + 0.5);
                    break;
                case 2:
                    r = Math.floor(p * 255.0 + 0.5);
                    g = Math.floor(brightness * 255.0 + 0.5);
                    b = Math.floor(t * 255.0 + 0.5);
                    break;
                case 3:
                    r = Math.floor(p * 255.0 + 0.5);
                    g = Math.floor(q * 255.0 + 0.5);
                    b = Math.floor(brightness * 255.0 + 0.5);
                    break;
                case 4:
                    r = Math.floor(t * 255.0 + 0.5);
                    g = Math.floor(p * 255.0 + 0.5);
                    b = Math.floor(brightness * 255.0 + 0.5);
                    break;
                case 5:
                    r = Math.floor(brightness * 255.0 + 0.5);
                    g = Math.floor(p * 255.0 + 0.5);
                    b = Math.floor(q * 255.0 + 0.5);
                    break;
            }
        }
        return 0xff000000 | (r << 16) | (g << 8) | (b << 0);
    }

}