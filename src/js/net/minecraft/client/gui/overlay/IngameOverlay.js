import Gui from "../Gui.js";
import Block from "../../world/block/Block.js";
import ChatOverlay from "./ChatOverlay.js";
import Minecraft from "../../Minecraft.js";

export default class IngameOverlay extends Gui {

    constructor(minecraft, window) {
        super();
        this.minecraft = minecraft;
        this.window = window;

        this.chatOverlay = new ChatOverlay(minecraft);

        this.textureCrosshair = minecraft.resources["gui/icons.png"];
        this.textureHotbar = minecraft.resources["gui/gui.png"];
    }

    render(stack, mouseX, mouseY, partialTicks) {
        // Render crosshair
        if (this.minecraft.hasInGameFocus()) {
            this.renderCrosshair(stack, this.window.width / 2, this.window.height / 2)
        }

        // Render hotbar
        this.renderHotbar(stack, this.window.width / 2 - 91, this.window.height - 22);

        // Render chat
        this.chatOverlay.render(stack, mouseX, mouseY, partialTicks);

        let world = this.minecraft.world;
        let player = this.minecraft.player;

        let x = Math.floor(player.x);
        let y = Math.floor(player.y);
        let z = Math.floor(player.z);

        let fps = Math.floor(this.minecraft.fps);
        let lightUpdates = world.lightUpdateQueue.length;
        let chunkUpdates = this.minecraft.worldRenderer.chunkSectionUpdateQueue.length;
        let lightLevel = world.getTotalLightAt(x, y, z);

        // Debug
        if (this.minecraft.settings.debugOverlay) {
            this.drawString(stack, "js-minecraft " + Minecraft.VERSION, 1, 1);
            this.drawString(stack, fps + " fps," + " " + lightUpdates + " light updates," + " " + chunkUpdates + " chunk updates", 1, 1 + 9 * 1);
            this.drawString(stack, x + ", " + y + ", " + z + " (" + (x >> 4) + ", " + (y >> 4) + ", " + (z >> 4) + ")", 1, 1 + 9 * 2);
            this.drawString(stack, "Light: " + lightLevel, 1, 1 + 9 * 3);
        }
    }

    onTick() {
        this.chatOverlay.onTick();
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
            x + this.minecraft.player.inventory.selectedSlotIndex * 20 - 1, y - 1,
            24, 24
        )

        // To make the items darker
        let brightness = this.minecraft.isPaused() ? 0.5 : 1; // TODO find a better solution

        this.minecraft.itemRenderer.prepareRender("hotbar");

        // Render items
        for (let i = 0; i < 9; i++) {
            let typeId = this.minecraft.player.inventory.getItemInSlot(i);
            if (typeId !== 0) {
                let block = Block.getById(typeId);
                this.minecraft.itemRenderer.renderItemInGui("hotbar", i, block, Math.floor(x + i * 20 + 11), y + 11, brightness);
            }
        }
    }

}