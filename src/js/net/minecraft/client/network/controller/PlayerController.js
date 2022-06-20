import PlayerEntity from "../../entity/PlayerEntity.js";

export default class PlayerController {

    constructor(minecraft) {
        this.minecraft = minecraft;
    }

    createPlayer(world) {
        return new PlayerEntity(this.minecraft, world, 0);
    }

    sendChatMessage(message) {
        // Handle message
        if (message.startsWith("/")) {
            this.minecraft.commandHandler.handleMessage(message.substring(1));
        } else {
            this.minecraft.addMessageToChat("<" + this.minecraft.player.username + "> " + message);
        }
    }
}