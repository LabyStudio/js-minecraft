import Command from "../Command.js";

export default class HelpCommand extends Command {

    constructor() {
        super("help", "", "Displays a list of commands")
    }

    execute(minecraft, args) {
        minecraft.addMessageToChat("&2--- Showing help page ---");
        minecraft.commandHandler.commands.forEach(command => {
            minecraft.addMessageToChat("/" + command.command + " " + command.usage + " - " + command.description);
        });
        return true;
    }

}