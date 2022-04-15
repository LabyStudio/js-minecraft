import TextCoord from "./TextCoord.js";
import Point from "./Point.js";
import Triangle from "./Triangle.js";

export default class IsometricRenderer {

    // http://jsfiddle.net/xzL58dha/3/

    static render(stack, triangles, callback) {
        for (let triangle of triangles) {
            IsometricRenderer.drawTriangle(
                stack,
                triangle.p0.x, triangle.p0.y,
                triangle.p1.x, triangle.p1.y,
                triangle.p2.x, triangle.p2.y,
                triangle.t0.u, triangle.t0.v,
                triangle.t1.u, triangle.t1.v,
                triangle.t2.u, triangle.t2.v,
                callback
            );
        }
    }

    static createTriangles(texture, p1, p2, p3, p4) {
        // clear triangles out
        let triangles = [];

        // generate subdivision
        let subs = 7; // vertical subdivisions
        let divs = 7; // horizontal subdivisions

        let dx1 = p4.x - p1.x;
        let dy1 = p4.y - p1.y;
        let dx2 = p3.x - p2.x;
        let dy2 = p3.y - p2.y;

        let imgW = texture.naturalWidth;
        let imgH = texture.naturalHeight;

        for (let sub = 0; sub < subs; ++sub) {
            let curRow = sub / subs;
            let nextRow = (sub + 1) / subs;

            let curRowX1 = p1.x + dx1 * curRow;
            let curRowY1 = p1.y + dy1 * curRow;

            let curRowX2 = p2.x + dx2 * curRow;
            let curRowY2 = p2.y + dy2 * curRow;

            let nextRowX1 = p1.x + dx1 * nextRow;
            let nextRowY1 = p1.y + dy1 * nextRow;

            let nextRowX2 = p2.x + dx2 * nextRow;
            let nextRowY2 = p2.y + dy2 * nextRow;

            for (let div = 0; div < divs; ++div) {
                let curCol = div / divs;
                let nextCol = (div + 1) / divs;

                let dCurX = curRowX2 - curRowX1;
                let dCurY = curRowY2 - curRowY1;
                let dNextX = nextRowX2 - nextRowX1;
                let dNextY = nextRowY2 - nextRowY1;

                let p1x = curRowX1 + dCurX * curCol;
                let p1y = curRowY1 + dCurY * curCol;

                let p2x = curRowX1 + (curRowX2 - curRowX1) * nextCol;
                let p2y = curRowY1 + (curRowY2 - curRowY1) * nextCol;

                let p3x = nextRowX1 + dNextX * nextCol;
                let p3y = nextRowY1 + dNextY * nextCol;

                let p4x = nextRowX1 + dNextX * curCol;
                let p4y = nextRowY1 + dNextY * curCol;

                let u1 = curCol * imgW;
                let u2 = nextCol * imgW;
                let v1 = curRow * imgH;
                let v2 = nextRow * imgH;

                let triangle1 = new Triangle(
                    new Point(p1x - 1, p1y),
                    new Point(p3x + 2, p3y + 1),
                    new Point(p4x - 1, p4y + 1),
                    new TextCoord(u1, v1),
                    new TextCoord(u2, v2),
                    new TextCoord(u1, v2)
                );

                let triangle2 = new Triangle(
                    new Point(p1x - 2, p1y),
                    new Point(p2x + 1, p2y),
                    new Point(p3x + 1, p3y + 1),
                    new TextCoord(u1, v1),
                    new TextCoord(u2, v1),
                    new TextCoord(u2, v2)
                );

                triangles.push(triangle1);
                triangles.push(triangle2);
            }
        }

        return triangles;
    }


    static drawTriangle(stack, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2, callback) {
        stack.save();

        // Clip the output to the on-screen triangle boundaries.
        stack.beginPath();
        stack.moveTo(x0, y0);
        stack.lineTo(x1, y1);
        stack.lineTo(x2, y2);
        stack.closePath();
        //ctx.stroke();//xxxxxxx for wireframe
        stack.clip();

        /*
        ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.

        The context matrix is:

        [ m11 m21 dx ]
        [ m12 m22 dy ]
        [  0   0   1 ]

        Coords are column vectors with a 1 in the z coord, so the transform is:
        x_out = m11 * x + m21 * y + dx;
        y_out = m12 * x + m22 * y + dy;

        From Maxima, these are the transform values that map the source
        coords to the dest coords:

        sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
        [m11 = - -----------------------------------------------------,
        sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

        sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
        m12 = -----------------------------------------------------,
        sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

        sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
        m21 = -----------------------------------------------------,
        sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

        sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
        m22 = - -----------------------------------------------------,
        sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

        sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
        dx = ----------------------------------------------------------------------,
        sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

        sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
        dy = ----------------------------------------------------------------------]
        sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
      */

        // TODO: eliminate common subexpressions.
        let denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
        if (denom === 0) {
            return;
        }
        let m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
        let m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
        let m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
        let m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
        let dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
        let dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

        stack.transform(m11, m12, m21, m22, dx, dy);

        // Draw the whole image.  Transform and clip will map it onto the
        // correct output triangle.
        //
        // TODO: figure out if drawImage goes faster if we specify the rectangle that
        // bounds the source coords.
        callback();
        stack.restore();
    };
}