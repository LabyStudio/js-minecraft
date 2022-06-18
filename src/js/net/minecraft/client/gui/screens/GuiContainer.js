import GuiScreen from "../GuiScreen.js";
import Block from "../../world/block/Block.js";

export default class GuiContainer extends GuiScreen {

    constructor(container) {
        super();

        this.inventoryWidth = 176;
        this.inventoryHeight = 166;

        this.container = container;

        this.hoverSlot = null;
    }

    init() {
        super.init();

        this.x = Math.floor((this.width - this.inventoryWidth) / 2);
        this.y = Math.floor((this.height - this.inventoryHeight) / 2);
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        this.drawDefaultBackground(stack);
        this.drawInventoryBackground(stack);
        this.drawString(stack, "Creative Inventory", this.x + 8, this.y + 6, 0x404040);

        // Rebuild items
        if (this.container.dirty) {
            this.container.dirty = false;
            this.minecraft.itemRenderer.destroy("inventory");
            this.minecraft.itemRenderer.scheduleDirty("hotbar");
        }

        // Draw slots
        this.hoverSlot = null;
        this.container.slots.forEach(slot => {
            this.drawSlot(stack, slot, mouseX, mouseY);
        });

        // Draw item in cursor
        let inventoryPlayer = this.minecraft.player.inventory;
        let typeId = inventoryPlayer.itemInCursor;
        if (typeId !== null && typeId !== 0) {
            let block = Block.getById(typeId);
            this.minecraft.itemRenderer.zIndex = 10;
            this.minecraft.itemRenderer.renderItemInGui(
                "inventory",
                "cursor",
                block,
                mouseX,
                mouseY
            );
            this.minecraft.itemRenderer.zIndex = 0;
        } else {
            this.minecraft.itemRenderer.destroy("inventory", "cursor");
        }

        // Draw title
        this.drawTitle(stack);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        super.mouseClicked(mouseX, mouseY, mouseButton);

        for (const slot of this.container.slots) {
            if (this.isMouseOverSlot(slot, mouseX, mouseY)) {
                this.container.onSlotClick(slot, this.minecraft.player);
            }
        }
    }

    keyTyped(key, character) {
        // Swap to slot
        for (let i = 1; i <= 9; i++) {
            if (key === 'Digit' + i && this.hoverSlot !== null) {
                this.container.swapWithHotbar(this.hoverSlot, this.minecraft.player.inventory, i - 1);
            }
        }

        return super.keyTyped(key, character);
    }

    drawSlot(stack, slot, mouseX, mouseY) {
        let x = this.x + slot.x;
        let y = this.y + slot.y;

        let inventory = slot.inventory;
        let typeId = inventory.getItemInSlot(slot.index);
        let isMouseOver = this.isMouseOverSlot(slot, mouseX, mouseY);

        // Render item
        if (typeId !== null && typeId !== 0) {
            let block = Block.getById(typeId);
            this.minecraft.itemRenderer.renderItemInGui(
                "inventory",
                inventory.name + ":" + slot.index,
                block,
                x + 8,
                y + 8,
                isMouseOver ? 1.5 : 1
            );
        }

        // Hover rectangle
        if (isMouseOver) {
            this.drawRect(stack, x, y, x + 16, y + 16, '#ffffff', 0.5);

            this.hoverSlot = slot;
        }
    }

    onClose() {
        super.onClose();

        this.minecraft.player.inventory.itemInCursor = null;
        this.minecraft.itemRenderer.destroy("inventory");
    }

    drawTitle(stack) {

    }

    drawInventoryBackground(stack) {

    }

    isMouseOverSlot(slot, mouseX, mouseY) {
        let x = this.x + slot.x;
        let y = this.y + slot.y;
        return mouseX >= x && mouseX <= x + 16 && mouseY >= y && mouseY <= y + 16;
    }
}