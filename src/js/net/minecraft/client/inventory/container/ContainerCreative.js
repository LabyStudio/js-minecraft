import Container from "../Container.js";
import GuiContainerCreative from "../../gui/screens/container/GuiContainerCreative.js";
import Slot from "../Slot.js";
import Block from "../../world/block/Block.js";
import InventoryPlayer from "../inventory/InventoryPlayer.js";

export default class ContainerCreative extends Container {

    constructor(player) {
        super();

        this.itemList = [];

        let playerInventory = player.inventory;

        // Add creative inventory slots
        for (let y = 0; y < 5; ++y) {
            for (let x = 0; x < 9; ++x) {
                this.addSlot(new Slot(GuiContainerCreative.inventory, y * 9 + x, 9 + x * 18, 18 + y * 18));
            }
        }

        // Add player hotbar
        for (let x = 0; x < 9; ++x) {
            this.addSlot(new Slot(playerInventory, x, 9 + x * 18, 112));
        }

        this.initItems();
        this.scrollTo(0);
    }

    swapWithHotbar(slot, inventoryPlayer, hotbarIndex) {
        let slotInventory = slot.inventory;
        let typeId = slotInventory.getItemInSlot(slot.index);

        inventoryPlayer.setItem(hotbarIndex, typeId);

        this.dirty = true;
    }

    onSlotClick(slot, player) {
        if (slot.inventory instanceof InventoryPlayer) {
            super.onSlotClick(slot, player);
        } else {
            let inventoryPlayer = player.inventory;
            inventoryPlayer.itemInCursor = slot.inventory.getItemInSlot(slot.index);
        }
        this.dirty = true;
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
                    GuiContainerCreative.inventory.setItem(x + y * 9, this.itemList[index]);
                } else {
                    GuiContainerCreative.inventory.setItem(x + y * 9, null);
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