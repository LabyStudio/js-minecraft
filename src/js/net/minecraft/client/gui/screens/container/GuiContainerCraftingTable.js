import GuiContainer from "../GuiContainer.js";
import ContainerCraftingTable from "../../../inventory/container/ContainerCraftingTable.js";
import InventoryBasic from "../../../inventory/inventory/InventoryBasic.js";

export default class GuiContainerCraftingTable extends GuiContainer {

    static inventory = new InventoryBasic();

    constructor(player) {
        super(new ContainerCraftingTable(player));

        this.inventoryWidth = 195;
        this.inventoryHeight = 165;
    }

    init() {
        this.textureInventory = this.getTexture("gui/container/crafting_table.png");

        super.init();
    }

    drawTitle(stack) {
        this.drawString(stack, "Crafting Table", this.x + 8, this.y + 6, 0xff404040, false);
    }

    drawInventoryBackground(stack) {
        this.drawSprite(
            stack,
            this.textureInventory,
            0,
            0,
            this.inventoryWidth,
            this.inventoryHeight,
            this.x,
            this.y,
            this.inventoryWidth,
            this.inventoryHeight
        );
    }

    keyTyped(key, character) {
        if (key === this.minecraft.settings.keyOpenInventory) {
            this.minecraft.displayScreen(null);
            return true;
        }

        return super.keyTyped(key, character);
    }

}