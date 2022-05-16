import Command from "../Command.js";

export default class TimeCommand extends Command {

    constructor() {
        super("time", "<set|add> <value>", "Change the time of the world")
    }

    execute(minecraft, args) {
        if (args.length !== 2) {
            return false;
        }

        let action = args[0];
        let value = args[1];

        if (action === "add") {
            if (isNaN(value)) {
                return false;
            } else {
                value = parseInt(value);
            }

            minecraft.world.time += value;
            minecraft.addMessageToChat("Added " + value + " to the time");
        } else if (action === "set") {
            if (isNaN(value)) {
                if (value === "day") {
                    value = 1000;
                } else if (value === "night") {
                    value = 13000;
                } else {
                    return false;
                }
            } else {
                value = parseInt(value);
            }

            minecraft.world.time = value;
            minecraft.addMessageToChat("Time set to " + value);
        } else {
            return false;
        }

        return true;
    }

}