import GuiButton from "./GuiButton.js";
import MathHelper from "../../../util/MathHelper.js";

export default class GuiSliderButtonVertical extends GuiButton {

    constructor(name, value, min, max, x, y, width, height, callback) {
        super(name, x, y, width, height, _ => callback(this.value));

        this.settingName = name;
        this.value = value;

        this.min = min;
        this.max = max;

        this.enabled = false;
        this.dragging = false;

        this.setDisplayNameBuilder((name, value) => {
            return name + ": " + value;
        })
    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        if (this.isMouseOver(mouseX, mouseY)) {
            this.dragging = true;
            return true;
        }
    }

    mouseDragged(mouseX, mouseY, mouseButton) {
        if (this.dragging) {
            let percent = (this.value - this.min) / (this.max - this.min);
            let offset = -4 + 8 * percent;
            this.value = Math.round(this.min + (mouseY + offset - this.y) / this.height * (this.max - this.min));
            this.value = MathHelper.clamp(this.value, this.min, this.max);

            this.string = this.getDisplayName(this.settingName, this.value);
            this.callback();
        }
    }

    mouseReleased(mouseX, mouseY, mouseButton) {
        this.dragging = false;
    }

    render(stack, mouseX, mouseY, partialTicks) {
        let mouseOver = this.isMouseOver(mouseX, mouseY);
        let percent = (this.value - this.min) / (this.max - this.min);
        let offset = Math.round(percent * (this.height - 8));

        this.drawButton(stack, this.enabled, mouseOver, this.x, this.y, this.width, this.height);
        this.drawButton(stack, true, false, this.x , this.y+offset, this.width, 8);
        this.drawCenteredString(stack, this.string, this.x + this.width / 2, this.y + this.height / 2 - 4);
    }

    setDisplayNameBuilder(builder) {
        this.getDisplayName = builder;
        this.string = this.getDisplayName(this.settingName, this.value);
        return this;
    }
}