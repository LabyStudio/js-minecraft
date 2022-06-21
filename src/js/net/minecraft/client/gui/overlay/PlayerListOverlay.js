import Gui from "../Gui.js";
import FontRenderer from "../../render/gui/FontRenderer.js";

export default class PlayerListOverlay extends Gui {

    constructor(minecraft, ingameOverlay) {
        super();

        this.minecraft = minecraft;
        this.window = minecraft.window;
        this.ingameOverlay = ingameOverlay;
        this.dirty = true;

        this.header = null;
        this.footer = null;
    }

    renderPlayerList(stack, width) {
        if (this.dirty) {
            let subStack = this.window.canvasPlayerList.getContext("2d");
            this.reinitialize(subStack, width);
        }

        stack.drawImage(this.window.canvasPlayerList, 0, 0);
    }

    reinitialize(stack, width) {
        this.dirty = false;

        let playerInfoMap = this.minecraft.playerController.getNetworkHandler().getPlayerInfoMap();
        let maxPlayerNameWidth = 0;
        let maxScoreValueWidth = 0; // TODO

        // Calculate max scoreboard width entry
        for (let [uuid, playerInfo] of playerInfoMap) {
            let displayName = playerInfo.displayName === null ? playerInfo.profile.getUsername() : playerInfo.displayName;
            let playerLength = this.getStringWidth(stack, displayName);

            // Find max player length
            maxPlayerNameWidth = Math.max(maxPlayerNameWidth, playerLength);
        }

        // Get the max width of the scoreboard
        let maxScoreWidth = 0; // TODO

        let screenWidth = this.window.width;
        let playerAmount = playerInfoMap.size;
        let rows = playerAmount;

        // Calculate max columns
        let columns;
        for (columns = 1; rows > 20; rows = Math.floor((playerAmount + columns - 1) / columns)) {
            columns++;
        }

        let isOnlineMode = true; // TODO
        let columnWidth = Math.min(
            columns * ((isOnlineMode ? 9 : 0) + maxPlayerNameWidth + maxScoreWidth + 13),
            screenWidth - 50
        ) / columns;

        // Clear canvas
        stack.clearRect(0, 0, this.window.width, this.window.height);

        let x = Math.floor(screenWidth / 2) - Math.floor((columnWidth * columns + (columns - 1) * 5) / 2);
        let y = 10;

        // Calculate background with of columns
        let backgroundWidth = columnWidth * columns + (columns - 1) * 5;

        // Calculate header
        let headerLines = null;
        if (this.header !== null) {
            headerLines = this.minecraft.fontRenderer.listFormattedStringToWidth(this.header, width - 50);

            for (let line of headerLines) {
                backgroundWidth = Math.max(backgroundWidth, this.getStringWidth(stack, line));
            }
        }

        // Calculate footer
        let footerLines = null;
        if (this.footer !== null) {
            footerLines = this.minecraft.fontRenderer.listFormattedStringToWidth(this.footer, width - 50);

            for (let line of footerLines) {
                backgroundWidth = Math.max(backgroundWidth, this.getStringWidth(stack, line));
            }
        }

        if (headerLines !== null) {
            this.drawRect(
                stack,
                Math.floor(width / 2) - Math.floor(backgroundWidth / 2) - 1,
                y - 1,
                Math.floor(width / 2) + Math.floor(backgroundWidth / 2) + 1,
                y + headerLines.length * FontRenderer.FONT_HEIGHT,
                'rgba(0,0,0,0.5)'
            );

            for (let i = 0; i < headerLines.length; i++) {
                this.drawCenteredString(
                    stack,
                    headerLines[i],
                    Math.floor(width / 2) + 1,
                    y
                );
                y += FontRenderer.FONT_HEIGHT;
            }
            y++;
        }

        // Render player list background
        this.drawRect(
            stack,
            Math.floor(screenWidth / 2) - Math.floor(backgroundWidth / 2) - 1,
            y - 1,
            Math.floor(screenWidth / 2) + Math.floor(backgroundWidth / 2) + 1,
            y + rows * FontRenderer.FONT_HEIGHT,
            'rgba(0,0,0,0.5)'
        );

        let i = 0;
        for (let [uuid, playerInfo] of playerInfoMap) {
            let indexX = Math.floor(i / rows);
            let indexY = i % rows;

            let entryX = x + indexX * columnWidth + indexX * 5;
            let entryY = y + indexY * FontRenderer.FONT_HEIGHT;

            // Check if index is inside of range
            if (i < playerInfoMap.size) {
                let pingX = entryX + columnWidth - 1;
                let displayName = playerInfo.displayName === null ? playerInfo.profile.getUsername() : playerInfo.displayName;

                // Render player entry background
                this.drawRect(
                    stack,
                    entryX,
                    entryY,
                    entryX + columnWidth - 1,
                    entryY + (FontRenderer.FONT_HEIGHT - 1),
                    'rgba(255,255,255,0.13)'
                );

                // Render player head
                if (isOnlineMode) {
                    let size = FontRenderer.FONT_HEIGHT - 1;

                    this.drawRect(
                        stack,
                        entryX,
                        entryY,
                        entryX + size,
                        entryY + size,
                        'rgb(0,0,0)'
                    );

                    entryX += size + 1;
                }

                // Render player name
                this.drawString(stack, displayName, entryX + 1.0, entryY - (FontRenderer.FONT_HEIGHT > 9 ? 0.5 : 0.0))

                // Render ping
                let ping = playerInfo.ping;
                let spriteOffset = ping < 0 ? 5 : ping < 150 ? 0 : ping < 300 ? 1 : ping < 600 ? 2 : ping < 1000 ? 3 : 4;
                this.drawSprite(
                    stack,
                    this.ingameOverlay.textureCrosshair,
                    0,
                    16 + spriteOffset * 8,
                    10,
                    8,
                    pingX - FontRenderer.FONT_HEIGHT - 1,
                    entryY + 1,
                    10,
                    8,
                    'rgb(0,0,0)'
                );
            }

            i++;
        }

        if (footerLines !== null) {
            y = y + rows * 9 + 1;

            this.drawRect(
                stack,
                Math.floor(width / 2) - Math.floor(backgroundWidth / 2) - 1,
                y - 1,
                Math.floor(width / 2) + Math.floor(backgroundWidth / 2) + 1,
                y + footerLines.length * FontRenderer.FONT_HEIGHT,
                'rgba(0,0,0,0.5)'
            );

            for (let i = 0; i < footerLines.length; i++) {
                this.drawCenteredString(
                    stack,
                    footerLines[i],
                    Math.floor(width / 2) + 1,
                    y
                );
                y += FontRenderer.FONT_HEIGHT;
            }
            y++;
        }
    }

    setDirty() {
        this.dirty = true;
    }

    setHeader(header) {
        this.header = header;
    }

    setFooter(footer) {
        this.footer = footer;
    }
}