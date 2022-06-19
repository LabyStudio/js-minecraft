import PacketHandler from "./PacketHandler.js";
import GuiDisconnected from "../../gui/screens/GuiDisconnected.js";
import WorldClient from "../../world/WorldClient.js";
import ClientKeepAlivePacket from "../packet/play/client/ClientKeepAlivePacket.js";
import PlayerControllerMultiplayer from "../controller/PlayerControllerMultiplayer.js";
import ClientPlayerPositionRotationPacket from "../packet/play/client/ClientPlayerPositionRotationPacket.js";

export default class NetworkPlayHandler extends PacketHandler {

    constructor(networkManager, profile) {
        super();

        this.minecraft = networkManager.minecraft;
        this.networkManager = networkManager;
        this.profile = profile;

        this.playerInfoMap = new Map();
    }

    handleKeepAlive(packet) {
        this.networkManager.sendPacket(new ClientKeepAlivePacket(packet.getId()));
    }

    handleJoinGame(packet) {
        this.minecraft.playerController = new PlayerControllerMultiplayer(this.minecraft, this);
        let world = new WorldClient(this.minecraft);
        this.minecraft.loadWorld(world);
    }

    handleServerChat(packet) {
        if (packet.getType() !== 2) {
            this.minecraft.ingameOverlay.chatOverlay.addMessage(packet.getMessage());
        }
    }

    handleServerPlayerListEntry(packet) {
        for (let entry of packet.getPlayers()) {
            let uuid = entry.profile.getId().toString();

            if (packet.getAction() === 4) { // REMOVE_PLAYER
                this.playerInfoMap.delete(uuid);
            } else {
                if (packet.getAction() === 0) { // ADD_PLAYER
                    this.playerInfoMap.set(uuid, entry);
                }

                let playerInfo = this.playerInfoMap.get(uuid);
                if (playerInfo !== null && typeof playerInfo !== "undefined") {
                    switch (packet.getAction()) {
                        case 0: // ADD_PLAYER
                            playerInfo.gameType = entry.gameType;
                            playerInfo.ping = entry.ping;
                            break;
                        case 1: // UPDATE_GAMEMODE
                            playerInfo.gameType = entry.gameType;
                            break;
                        case 2: // UPDATE_LATENCY
                            playerInfo.ping = entry.ping;
                            break;
                        case 3: // UPDATE_DISPLAY_NAME
                            playerInfo.displayName = entry.displayName;
                            break;
                    }
                }
            }
        }

        this.minecraft.ingameOverlay.playerListOverlay.setDirty();
    }

    handleServerPlayerListData(packet) {
        this.minecraft.ingameOverlay.playerListOverlay.setHeader(packet.getHeader());
        this.minecraft.ingameOverlay.playerListOverlay.setFooter(packet.getFooter());
    }

    handleServerPlayerPositionRotation(packet) {
        let player = this.minecraft.player;

        let x = packet.getX();
        let y = packet.getY();
        let z = packet.getZ();
        let yaw = packet.getYaw();
        let pitch = packet.getPitch();

        if (packet.hasFlag(0x01)) {
            x += player.x;
        } else {
            player.motionX = 0;
        }

        if (packet.hasFlag(0x02)) {
            y += player.y;
        } else {
            player.motionY = 0;
        }

        if (packet.hasFlag(0x04)) {
            z += player.z;
        } else {
            player.motionZ = 0;
        }

        if (packet.hasFlag(0x08)) {
            yaw += player.rotationYaw;
        }

        if (packet.hasFlag(0x10)) {
            pitch += player.rotationPitch;
        }

        player.setPosition(x, y, z);
        player.setRotation(yaw, pitch);

        this.networkManager.sendPacket(new ClientPlayerPositionRotationPacket(player.x, player.y, player.z, player.rotationYaw, player.rotationPitch, player.onGround));
    }

    handleChunkData(packet) {
        let provider = this.minecraft.world.getChunkProvider();

        if (packet.isFullChunk()) {
            if (packet.getMask() === 0) {
                provider.unloadChunk(packet.getX(), packet.getZ());
                return;
            }

            provider.loadChunk(packet.getX(), packet.getZ());
        }

        let chunk = this.minecraft.world.getChunkAt(packet.getX(), packet.getZ());
        chunk.fillChunk(packet.getData(), packet.getMask(), packet.isFullChunk());
    }

    handleMultiChunkData(packet) {
        for (let chunkData of packet.getChunkData()) {
            this.handleChunkData(chunkData);
        }
    }

    handleBlockChange(packet) {
        let position = packet.getBlockPosition();

        let blockState = packet.getBlockState();
        let typeId = blockState >> 4;

        this.minecraft.world.setBlockAt(position.getX(), position.getY(), position.getZ(), typeId);
    }

    handleDisconnect(packet) {
        this.minecraft.loadWorld(null);
        this.minecraft.displayScreen(new GuiDisconnected(packet.getReason()));
    }

    onDisconnect() {
        this.minecraft.loadWorld(null);
        this.minecraft.displayScreen(new GuiDisconnected("Disconnected from server"));
    }

    getNetworkManager() {
        return this.networkManager;
    }

    getPlayerInfoMap() {
        return this.playerInfoMap;
    }

    sendPacket(packet) {
        this.networkManager.sendPacket(packet);
    }

}