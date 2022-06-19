import Gui from "../Gui.js";
import Block from "../../world/block/Block.js";
import ChatOverlay from "./ChatOverlay.js";
import Minecraft from "../../Minecraft.js";
import EnumBlockFace from "../../../util/EnumBlockFace.js";
import MathHelper from "../../../util/MathHelper.js";
import FontRenderer from "../../render/gui/FontRenderer.js";
import EnumSkyBlock from "../../../util/EnumSkyBlock.js";
import PlayerListOverlay from "./PlayerListOverlay.js";
import Keyboard from "../../../util/Keyboard.js";

export default class IngameOverlay extends Gui {

    constructor(minecraft, window) {
        super();
        this.minecraft = minecraft;
        this.window = window;

        this.chatOverlay = new ChatOverlay(minecraft);
        this.playerListOverlay = new PlayerListOverlay(minecraft, this);

        this.textureCrosshair = minecraft.resources["gui/icons.png"];
        this.textureHotbar = minecraft.resources["gui/gui.png"];

        this.ticksRendered = 0;
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

        // Render debug canvas on stack
        if (this.minecraft.settings.debugOverlay) {
            stack.drawImage(this.window.canvasDebug, 0, 0);
        }

        // Render player list
        if (Keyboard.isKeyDown(this.minecraft.settings.keyPlayerList) && !this.minecraft.isSingleplayer()) {
            this.playerListOverlay.renderPlayerList(stack, this.window.width);
        }
    }

    onTick() {
        this.chatOverlay.onTick();

        // Render debug overlay on tick
        if (this.minecraft.settings.debugOverlay) {
            let stack = this.window.canvasDebug.getContext('2d');

            // Render debug overlay each tick if the player is moving
            if (this.ticksRendered % 10 === 0) {
                // Clear debug canvas
                stack.clearRect(0, 0, this.window.width, this.window.height);

                // Render debug information
                this.renderLeftDebugOverlay(stack);
                this.renderRightDebugOverlay(stack);
            } else if (this.minecraft.player.isMoving()) {
                // Render debug information
                this.renderLeftDebugOverlay(stack, [5, 6, 7, 8]);
            }

            this.ticksRendered++;
        }
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

    renderLeftDebugOverlay(stack, filters = []) {
        let world = this.minecraft.world;
        let player = this.minecraft.player;
        let worldRenderer = this.minecraft.worldRenderer;

        let x = player.x;
        let y = player.y;
        let z = player.z;

        let yaw = MathHelper.wrapAngleTo180(player.rotationYaw);
        let pitch = player.rotationPitch;

        let facingIndex = (((yaw + 180) * 4.0 / 360.0) + 0.5) & 3;
        let facing = EnumBlockFace.values()[facingIndex + 2];

        let fixedX = x.toFixed(2);
        let fixedY = y.toFixed(2);
        let fixedZ = z.toFixed(2);

        let blockX = Math.floor(x);
        let blockY = Math.floor(y);
        let blockZ = Math.floor(z);

        let chunkX = blockX >> 4;
        let chunkY = blockY >> 4;
        let chunkZ = blockZ >> 4;

        let inChunkX = blockX & 0xF;
        let inChunkY = blockY & 0xF;
        let inChunkZ = blockZ & 0xF;

        let visibleChunks = 0;
        let loadedChunks = 0;
        for (let [index, chunk] of world.getChunkProvider().getChunks()) {
            for (let y in chunk.sections) {
                let chunkSection = chunk.sections[y];
                if (chunkSection.group.visible) {
                    visibleChunks++;
                }
                loadedChunks++;
            }
        }
        let visibleEntities = 0;
        for (let index in world.entities) {
            let entity = world.entities[index];
            if (entity.renderer.group.visible) {
                visibleEntities++;
            }
        }

        let fps = Math.floor(this.minecraft.fps);
        let viewDistance = this.minecraft.settings.viewDistance;
        let lightUpdates = world.lightUpdateQueue.length;
        let chunkUpdates = worldRenderer.chunkSectionUpdateQueue.length;
        let entities = world.entities.length;
        let particles = this.minecraft.particleRenderer.particles.length;
        let skyLight = world.getSavedLightValue(EnumSkyBlock.SKY, blockX, blockY, blockZ);
        let blockLight = world.getSavedLightValue(EnumSkyBlock.BLOCK, blockX, blockY, blockZ);
        let lightLevel = world.getTotalLightAt(blockX, blockY, blockZ);
        let biome = "T: " + world.getTemperature(blockX, blockY, blockZ) + " H: " + world.getHumidity(blockX, blockY, blockZ);

        let soundsLoaded = 0;
        let soundsPlaying = 0;
        let soundPool = this.minecraft.soundManager.soundPool;
        for (let [id, sounds] of Object.entries(soundPool)) {
            for (let sound of sounds) {
                soundsLoaded++;

                if (sound.isPlaying) {
                    soundsPlaying++;
                }
            }
        }

        let towards = "Towards " + (facing.isPositive() ? "positive" : "negative") + " " + (facing.isXAxis() ? "X" : "Z");

        let lines = [
            "js-minecraft " + Minecraft.VERSION,
            fps + " fps (" + chunkUpdates + " chunk updates) T: " + this.minecraft.maxFps,
            "C: " + visibleChunks + "/" + loadedChunks + " D: " + viewDistance + ", L: " + lightUpdates,
            "E: " + visibleEntities + "/" + entities + ", P: " + particles,
            "",
            "XYZ: " + fixedX + " / " + fixedY + " / " + fixedZ,
            "Block: " + blockX + " " + blockY + " " + blockZ,
            "Chunk: " + chunkX + " " + chunkY + " " + chunkZ + " in " + inChunkX + " " + inChunkY + " " + inChunkZ,
            "Facing: " + facing.getName() + " (" + towards + ") (" + yaw.toFixed(1) + " / " + pitch.toFixed(1) + ")",
            "Light: " + lightLevel + " (" + skyLight + " sky, " + blockLight + " block)",
            // "Biome: " + biome,
            "",
            "Sounds: " + soundsPlaying + "/" + soundsLoaded,
            "Time: " + world.time % 24000 + " (Day " + Math.floor(world.time / 24000) + ")",
            "Cursor: " + this.minecraft.window.focusState.getName()
        ]

        // Hit result
        let hit = worldRenderer.lastHitResult;
        if (hit !== null && hit.type !== 0) {
            lines.push("Looking at: " + hit.x + " " + hit.y + " " + hit.z);
        }

        // Draw lines
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length === 0 || filters.length !== 0 && !filters.includes(i)) {
                continue;
            }

            // Clear the line
            if (filters.length !== 0) {
                stack.clearRect(
                    1,
                    1 + FontRenderer.FONT_HEIGHT * i,
                    this.getStringWidth(stack, lines[i]) + 1,
                    FontRenderer.FONT_HEIGHT
                );
            }

            // Draw background
            this.drawRect(stack,
                1,
                1 + FontRenderer.FONT_HEIGHT * i,
                1 + this.getStringWidth(stack, lines[i]) + 1,
                1 + FontRenderer.FONT_HEIGHT * i + FontRenderer.FONT_HEIGHT,
                '#50505090'
            );

            // Draw line
            this.drawString(stack, lines[i], 2, 2 + FontRenderer.FONT_HEIGHT * i, 0xffe0e0e0, false);
        }

    }

    renderRightDebugOverlay(stack) {
        let memoryLimit = this.minecraft.window.getMemoryLimit();
        let memoryUsed = this.minecraft.window.getMemoryUsed();
        let memoryAllocated = this.minecraft.window.getMemoryAllocated();

        let usedPercentage = Math.floor(memoryUsed / memoryLimit * 100);
        let allocatedPercentage = Math.floor(memoryAllocated / memoryLimit * 100);

        let width = this.window.canvas.width;
        let height = this.window.canvas.height;

        let lines = [
            "Mem: " + usedPercentage + "% " + this.humanFileSize(memoryUsed, memoryLimit),
            "Allocated: " + allocatedPercentage + "% " + this.humanFileSize(null, memoryAllocated),
            "",
            "Display: " + width + "x" + height,
            this.window.getGPUName()
        ];

        // Draw lines
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length === 0) {
                continue;
            }

            // Draw background
            this.drawRect(stack,
                this.window.width - this.getStringWidth(stack, lines[i]) - 3,
                1 + FontRenderer.FONT_HEIGHT * i,
                this.window.width - 1,
                1 + FontRenderer.FONT_HEIGHT * i + FontRenderer.FONT_HEIGHT,
                '#50505090'
            );

            // Draw line
            this.drawRightString(stack, lines[i], this.window.width - 2, 2 + FontRenderer.FONT_HEIGHT * i, 0xffe0e0e0, false);
        }
    }

    humanFileSize(bytesUsed, bytesMax) {
        if (Math.abs(bytesMax) < 1000) {
            return (bytesUsed === null ? "" : bytesUsed + "/") + bytesMax + "B";
        }
        const units = ['kB', 'MB'];
        let u = -1;
        const r = 10;
        const thresh = 1000;

        do {
            if (bytesUsed !== null) {
                bytesUsed /= thresh;
            }
            bytesMax /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytesMax) * r) / r >= thresh && u < units.length - 1);
        return (bytesUsed === null ? "" : bytesUsed.toFixed(0) + "/") + bytesMax.toFixed(0) + units[u];
    }
}