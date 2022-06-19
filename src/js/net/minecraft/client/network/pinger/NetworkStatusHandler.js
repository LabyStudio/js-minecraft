import PacketHandler from "../handler/PacketHandler.js";
import GuiDisconnected from "../../gui/screens/GuiDisconnected.js";

export default class NetworkStatusHandler extends PacketHandler {

    constructor(minecraft, callback) {
        super();

        this.minecraft = minecraft;
        this.callback = callback;
    }

    handleStatusResponse(packet) {
        this.callback(packet.object);
    }

    onDisconnect() {
        this.minecraft.displayScreen(new GuiDisconnected("NetworkManager lost"));
    }

}