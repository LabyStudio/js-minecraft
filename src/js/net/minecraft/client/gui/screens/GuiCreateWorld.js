import GuiScreen from "../GuiScreen.js";
import GuiButton from "../widgets/GuiButton.js";
import World from "../../world/World.js";
import GuiTextField from "../widgets/GuiTextField.js";
import Random from "../../../util/Random.js";
import Long from "../../../../../../../libraries/long.js";
import ChunkProviderGenerate from "../../world/provider/ChunkProviderGenerate.js";
import PlayerController from "../../network/controller/PlayerController.js";
import {require} from "../../../../../Start.js"

let self=null;
export default class GuiCreateWorld extends GuiScreen {

    constructor(previousScreen) {
        super();
        self=this;
        this.pako=require("pako");
        this.previousScreen = previousScreen;
        
    }
   
    wait() {
      
    }



    upload()
    {
        const i=document.createElement("input");
        i.type="file";
        this.loadready=false;
        i.addEventListener("change", loadFile, false);
        document.body.appendChild(i);
        i.click();
        this.wait();
        function loadFile(){
            console.log(i.files); 
            let reader = new FileReader();

            reader.readAsArrayBuffer(i.files[0]);
            

            reader.onload = function() {
                console.log(reader.result)
                let decompressed = self.pako.inflate(reader.result,{chunkSize: 8192 });
                let json = new TextDecoder("utf-8").decode(decompressed);
                let downloaddata=JSON.parse(json);

                localStorage.setItem("continue",true);
                let seed = downloaddata.seed;
                if (seed.length === 0) {
                    seed = new Random().nextLong();
                } else if (isNaN(seed)) {
                    let h = 0;
                    for (let i = 0; i < seed.length; i++) {
                        h = 31 * h + seed.charCodeAt(i);
                    }
                    seed = Long.fromNumber(h);
                }
                window.app.seed=seed;
                window.app.playerx=downloaddata.player_x;
                window.app.playerz=downloaddata.player_z;
                window.app.changedBlocksArray=JSON.parse(downloaddata.blocks);
                window.app.changedBlocksDataArray=JSON.parse(downloaddata.data);

                // Load world
                let world = new World(self.minecraft);
                world.setChunkProvider(new ChunkProviderGenerate(world, seed));
                world.getChunkProvider().findSpawn();

                self.minecraft.playerController = new PlayerController(self.minecraft);
                self.minecraft.loadWorld(world);
                self.loadready=true;
            };
            
            reader.onerror = function() {
                console.log(reader.error);
            };
            document.body.removeChild(i);
        }
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
            window.app.seed=seed;
            
            localStorage.setItem("continue",false);
            

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
        this.buttonList.push(new GuiButton("Continue", this.width / 2 - 155, y + 110+30, 150, 20, () => {
            localStorage.setItem("continue",true);
            let seed = localStorage.getItem("seed");
            if (seed.length === 0) {
                seed = new Random().nextLong();
            } else if (isNaN(seed)) {
                let h = 0;
                for (let i = 0; i < seed.length; i++) {
                    h = 31 * h + seed.charCodeAt(i);
                }
                seed = Long.fromNumber(h);
            }
            window.app.seed=seed;
            window.app.playerx=Math.round(localStorage.getItem("player_x"));
            window.app.playerz=Math.round(localStorage.getItem("player_z"));
            // Load world
            let world = new World(this.minecraft);
            world.setChunkProvider(new ChunkProviderGenerate(world, seed));
            world.getChunkProvider().findSpawn();

            this.minecraft.playerController = new PlayerController(this.minecraft);
            this.minecraft.loadWorld(world);
        }));
        this.buttonList.push(new GuiButton("Load", this.width / 2 +5, y + 110+30, 150, 20, () => {
            localStorage.setItem("continue",true);
            this.upload();
        }));

    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        this.minecraft.inhibitMouseDownInterval=true;
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
        this.minecraft.inhibitMouseDownInterval=false;
    }

}