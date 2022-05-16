export default class Command {

    constructor(command, usage, description) {
        this.command = command;
        this.usage = usage;
        this.description = description;
    }

    execute(minecraft, args) {
        return false;
    }

}