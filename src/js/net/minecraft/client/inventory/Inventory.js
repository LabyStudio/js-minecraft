window.Inventory = class {

    constructor() {
        this.selectedSlotIndex = 0;
        this.items = [];

        // Default items in inventory
        this.items[0] = 1;
        this.items[1] = 2;
        this.items[2] = 3;
        this.items[3] = 17;
        this.items[4] = 18;
        this.items[5] = 12;
        this.items[6] = 50;
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