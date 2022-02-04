window.IngameOverlay = class extends Gui {

    constructor(minecraft, window) {
        super();
        this.minecraft = minecraft;
        this.window = window;

        this.textureCrosshair = Gui.loadTexture("icons.png");
        this.textureHotbar = Gui.loadTexture("gui.png");
        this.textureTerrain = Gui.loadTexture("terrain.png");
    }

    render(stack, mouseX, mouseY, partialTicks) {
        if (this.minecraft.hasInGameFocus()) {
            this.renderCrosshair(stack, this.window.width / 2, this.window.height / 2)
        }

        this.renderHotbar(stack, this.window.width / 2 - 100, this.window.height - 22);
    }

    renderCrosshair(stack, x, y) {
        let size = 15;
        this.drawSprite(stack, this.textureCrosshair, 0, 0, 15, 15, x - size / 2, y - size / 2, size, size, 0.6);
    }

    renderHotbar(stack, x, y) {
        this.drawSprite(stack, this.textureHotbar, 0, 0, 200, 22, x, y, 200, 22)
        this.drawSprite(
            stack,
            this.textureHotbar,
            0, 22,
            24, 24,
            x + this.minecraft.inventory.selectedSlotIndex * 20 - 1, y - 1,
            24, 24
        )

        for (let i = 0; i < 9; i++) {
            let typeId = this.minecraft.inventory.getItemInSlot(i);

            if (typeId !== 0) {
                /*this.renderBlock(
                    stack,
                    this.textureTerrain, Block.getById(typeId),
                    x + i * 20 + 11,
                    y + 9
                );*/

                // UV Mapping
                let textureIndex = Block.getById(typeId).getTextureForFace(EnumBlockFace.NORTH);
                let minU = (textureIndex % 16) / 16.0;
                let minV = Math.floor(textureIndex / 16) / 16.0;

                this.drawSprite(stack, this.textureTerrain, minU * 256, minV, 16, 16, x + 3, y + 3, 16, 16)
            }
        }
    }

}