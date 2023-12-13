import Container from "../Container.js";
import Slot from "../Slot.js";
import Block from "../../world/block/Block.js";
import GuiContainerCraftingTable from "../../gui/screens/container/GuiContainerCraftingTable.js";

export default class ContainerCraftingTable extends Container {

    constructor(player) {
        super();

        this.itemList = [];

        let playerInventory = player.inventory;

        // Add crafting table slots
        for (let y = 0; y < 3; ++y) {
            for (let x = 0; x < 3; ++x) {
                this.addSlot(new Slot(playerInventory,  (y * 3 + x) + 36, 30 + x * 18, 17 + y * 18));
            }
        }

        // Add crafting result slot
        this.addSlot(new Slot(playerInventory,  45, 124, 35));

        // Add inventory slots
        for (let y = 0; y < 3; ++y) {
            for (let x = 0; x < 9; ++x) {
                this.addSlot(new Slot(playerInventory,  (y * 9 + x) + 9, 8 + x * 18, 84 + y * 18));
            }
        }

        // Add player hotbar
        for (let x = 0; x < 9; ++x) {
            this.addSlot(new Slot(playerInventory, x, 8 + x * 18, 142));
        }

        this.initItems();
        this.scrollTo(0);
    }

    scrollTo(scrollOffset) {
        let xOffset = (this.itemList.length + 9 - 1) / 9 - 5;
        let yOffset = Math.floor((scrollOffset * xOffset) + 0.5);

        if (yOffset < 0) {
            yOffset = 0;
        }

        for (let y = 0; y < 5; ++y) {
            for (let x = 0; x < 9; ++x) {
                let index = x + (y + yOffset) * 9;

                if (index >= 0 && index < this.itemList.length) {
                    GuiContainerCraftingTable.inventory.setItem(x + y * 9, this.itemList[index]);
                } else {
                    GuiContainerCraftingTable.inventory.setItem(x + y * 9, null);
                }
            }
        }
    }

    initItems() {
        Block.blocks.forEach((block) => {
            this.itemList.push(block.getId());
        });
    }
}