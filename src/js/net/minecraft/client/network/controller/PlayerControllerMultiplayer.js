import PlayerController from "./PlayerController.js";
import PlayerEntityMultiplayer from "../../entity/PlayerEntityMultiplayer.js";
import ClientChatPacket from "../packet/play/client/ClientChatPacket.js";

export default class PlayerControllerMultiplayer extends PlayerController {

    constructor(minecraft, networkHandler) {
        super(minecraft);

        this.networkHandler = networkHandler;
    }

    createPlayer(world) {
        return new PlayerEntityMultiplayer(this.minecraft, world, this.networkHandler);
    }

    sendChatMessage(message) {
        this.networkHandler.sendPacket(new ClientChatPacket(message));
    }

    getNetworkHandler() {
        return this.networkHandler;
    }
}