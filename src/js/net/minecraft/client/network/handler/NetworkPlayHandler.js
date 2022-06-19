import PacketHandler from "./PacketHandler.js";
import GuiDisconnected from "../../gui/screens/GuiDisconnected.js";
import WorldClient from "../../world/WorldClient.js";
import ClientKeepAlivePacket from "../packet/play/client/ClientKeepAlivePacket.js";
import PlayerControllerMultiplayer from "../controller/PlayerControllerMultiplayer.js";

export default class NetworkPlayHandler extends PacketHandler {

    constructor(networkManager, profile) {
        super();

        this.minecraft = networkManager.minecraft;
        this.networkManager = networkManager;
        this.profile = profile;
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
        this.minecraft.ingameOverlay.chatOverlay.addMessage(packet.getMessage());
    }

    handleChunkData(packet) {
        let provider = this.minecraft.world.getChunkProvider();

        if (packet.isFullChunk()) {
            if (packet.getDataSize() === 0) {
                provider.unloadChunk(packet.getX(), packet.getZ());
                return;
            }

            provider.loadChunk(packet.getX(), packet.getZ());
        }

        let chunk = this.minecraft.world.getChunkAt(packet.getX(), packet.getZ());
        chunk.fillChunk(packet.getData(), packet.getDataSize(), packet.isFullChunk());
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

    onDisconnect() {
        if (this.minecraft.isInGame()) {
            this.minecraft.displayScreen(new GuiDisconnected("Disconnected from server"));
        }
    }

    getNetworkManager() {
        return this.networkManager;
    }

    sendPacket(packet) {
        this.networkManager.sendPacket(packet);
    }

}