window.IngameOverlay = class extends Gui {

    constructor(minecraft, window) {
        super();
        this.minecraft = minecraft;
        this.window = window;

        this.textureCrosshair = Gui.loadTexture("icons.png");
        this.textureHotbar = Gui.loadTexture("gui.png");
    }

    render(stack, mouseX, mouseY, partialTicks) {
        if (this.minecraft.hasInGameFocus()) {
            this.renderCrosshair(stack, this.window.width / 2, this.window.height / 2)
        }

        this.renderHotbar(stack, this.window.width / 2 - 91, this.window.height - 22);

        // Debug
        this.drawString(stack, Math.floor(this.minecraft.timer.fps) + " fps," +
            " " + this.minecraft.world.lightUpdateQueue.length + " light updates," +
            " " + this.minecraft.worldRenderer.chunkSectionUpdateQueue.length + " chunk updates", 1, 1);
        this.drawString(stack, Math.floor(this.minecraft.player.x) + ", " + Math.floor(this.minecraft.player.y) + ", " + Math.floor(this.minecraft.player.z)
            + " (" + Math.floor(this.minecraft.player.x >> 4) + ", " + Math.floor(this.minecraft.player.y >> 4) + ", " + Math.floor(this.minecraft.player.z >> 4) + ")", 1, 1 + 9);
    }

    renderCrosshair(stack, x, y) {
        let size = 15;
        this.drawSprite(stack, this.textureCrosshair, 0, 0, 15, 15, x - size / 2, y - size / 2, size, size, 0.6);
    }

    renderHotbar(stack, x, y) {
        // Render background
        this.drawSprite(stack, this.textureHotbar, 0, 0, 200, 22, x, y, 200, 22)
        this.drawSprite(
            stack,
            this.textureHotbar,
            0, 22,
            24, 24,
            x + this.minecraft.inventory.selectedSlotIndex * 20 - 1, y - 1,
            24, 24
        )

        // Render items
        for (let i = 0; i < 9; i++) {
            let typeId = this.minecraft.inventory.getItemInSlot(i);
            if (typeId !== 0) {
                let renderId = "hotbar" + i;
                let block = Block.getById(typeId);
                this.minecraft.itemRenderer.renderItemInGui(renderId, block, x + i * 20 + 11, y + 11);
            }
        }
    }

}