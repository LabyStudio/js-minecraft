import Inventory from "../Inventory.js";

export default class InventoryBasic extends Inventory {

    constructor() {
        super("basic");

        this.items = [];
    }

    getItemInSlot(index) {
        return this.items[index];
    }

    setItem(index, typeId) {
        this.items[index] = typeId;
    }

}