import Inventory from "../Inventory.js";

export default class InventoryPlayer extends Inventory {

    constructor() {
        super("player");

        this.selectedSlotIndex = 0;
        this.itemInCursor = null;
        this.items = [];
    }

    setItem(index, typeId) {
        this.items[index] = typeId === null ? 0 : typeId;
    }

    setItemInSelectedSlot(typeId) {
        this.items[this.selectedSlotIndex] = typeId;
    }

    getItemInSelectedSlot() {
        return this.getItemInSlot(this.selectedSlotIndex);
    }

    shiftSelectedSlot(offset) {
        if (this.selectedSlotIndex + offset < 0) {
            this.selectedSlotIndex = 9 + (this.selectedSlotIndex + offset);
        } else {
            this.selectedSlotIndex = (this.selectedSlotIndex + offset) % 9;
        }
    }

    getItemInSlot(slot) {
        return this.items.hasOwnProperty(slot) ? this.items[slot] : 0;
    }
}