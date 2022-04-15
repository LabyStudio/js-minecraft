export default class Point {
    constructor(x, y) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    length(point) {
        point = point ? point : new Point();
        let xs, ys;
        xs = point.x - this.x;
        xs = xs * xs;

        ys = point.y - this.y;
        ys = ys * ys;
        return Math.sqrt(xs + ys);
    }

}