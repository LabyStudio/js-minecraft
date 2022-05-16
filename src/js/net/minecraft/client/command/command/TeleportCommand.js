import Command from "../Command.js";

export default class TeleportCommand extends Command {

    constructor() {
        super("tp", "<x> <y> <y>", "Teleport to a position")
    }

    execute(minecraft, args) {
        if (args.length !== 3) {
            return false;
        }

        let x = parseInt(args[0]);
        let y = parseInt(args[1]);
        let z = parseInt(args[2]);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            return false;
        }

        minecraft.player.setPosition(x, y, z);
        minecraft.addMessageToChat("Teleported to " + x + " " + y + " " + z);

        return true;
    }

}