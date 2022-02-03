window.Gui = class {

    drawRect(stack, left, top, right, bottom, color, alpha = 1) {
        stack.fillStyle = color;
        stack.globalAlpha = alpha;
        stack.fillRect(left, top, right - left, bottom - top);
        stack.globalAlpha = alpha;
    }

}