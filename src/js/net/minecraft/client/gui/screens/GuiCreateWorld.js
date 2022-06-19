import GuiScreen from "../GuiScreen.js";
import GuiButton from "../widgets/GuiButton.js";
import World from "../../world/World.js";
import GuiTextField from "../widgets/GuiTextField.js";
import Random from "../../../util/Random.js";
import Long from "../../../../../../../libraries/long.js";
import ChunkProviderGenerate from "../../world/provider/ChunkProviderGenerate.js";
import PlayerController from "../../network/controller/PlayerController.js";

export default class GuiCreateWorld extends GuiScreen {

    constructor(previousScreen) {
        super();

        this.previousScreen = previousScreen;
    }

    init() {
        super.init();

        let y = this.height / 2 - 50;

        this.fieldSeed = new GuiTextField(this.width / 2 - 100, y + 30, 200, 20)
        this.fieldSeed.maxLength = 30;
        this.buttonList.push(this.fieldSeed);

        this.buttonList.push(new GuiButton("Create New World", this.width / 2 - 155, y + 110, 150, 20, () => {
            let seed = this.fieldSeed.getText();
            if (seed.length === 0) {
                seed = new Random().nextLong();
            } else if (isNaN(seed)) {
                let h = 0;
                for (let i = 0; i < seed.length; i++) {
                    h = 31 * h + seed.charCodeAt(i);
                }
                seed = Long.fromNumber(h);
            }

            // Load world
            let world = new World(this.minecraft);
            world.setChunkProvider(new ChunkProviderGenerate(world, seed));
            world.getChunkProvider().findSpawn();

            this.minecraft.playerController = new PlayerController(this.minecraft);
            this.minecraft.loadWorld(world);
        }));
        this.buttonList.push(new GuiButton("Cancel", this.width / 2 + 5, y + 110, 150, 20, () => {
            this.minecraft.displayScreen(this.previousScreen);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Background
        this.drawDefaultBackground(stack);

        // Title
        this.drawCenteredString(stack, "Create New World", this.width / 2, 50);

        let y = this.height / 2 - 50;

        // Seed
        this.drawString(stack, "Seed for the World Generator", this.width / 2 - 100, y + 17, -6250336);
        this.drawString(stack, "Leave blank for a random seed", this.width / 2 - 100, y + 55, -6250336);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

    onClose() {

    }

}