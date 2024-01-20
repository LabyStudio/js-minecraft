import GuiButton from "../widgets/GuiButton.js";
import GuiScreen from "../GuiScreen.js";
import GuiOptions from "./GuiOptions.js";
import {require} from "../../../../../Start.js"
import {get,set} from "../../../util/idbstore.js"
export default class GuiIngameMenu extends GuiScreen {

    constructor() {
        super();
        this.pako=require("pako");
    }
    download(data, fileName, contentType) {
        const a = document.createElement("a");

        a.href = URL.createObjectURL(new Blob([data], {
          type:contentType
        }));
        a.setAttribute("download",fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    init() {
        super.init();

        let y = this.height / 2 - 30;
        this.buttonList.push(new GuiButton("Back to game", this.width / 2 - 100, y, 200, 20, () => {
            this.minecraft.displayScreen(null);
        }));

        this.buttonList.push(new GuiButton("Options...", this.width / 2 - 100, y + 24, 200, 20, () => {
            this.minecraft.displayScreen(new GuiOptions(this));
        }));      
        if(window.app.isSingleplayer()){
            this.buttonList.push(new GuiButton("Download", this.width / 2 - 100, y + 70, 200, 20, () => {
                let downloaddata={};
                downloaddata.blocks=JSON.stringify(Array.from(window.app.world.changedBlocksMap));
                downloaddata.data=JSON.stringify(Array.from(window.app.world.changedBlocksDataMap));
                downloaddata.player_x=window.app.player.x;
                downloaddata.player_y=window.app.player.y;
                downloaddata.player_z=window.app.player.z;
                downloaddata.seed=window.app.seed;
                let downloaddataarr = new TextEncoder("utf-8").encode(JSON.stringify(downloaddata));
                let compressed = this.pako.deflate(downloaddataarr,{chunkSize: 8192 });
                console.log(compressed)
                this.download( compressed, 'mintblock.dat', 'application/octet-stream');
                this.minecraft.displayScreen(null);
            }));
            this.buttonList.push(new GuiButton("Save and Quit to Title", this.width / 2 - 100, y + 94, 200, 20, () => {
                
                window.app.changedBlocksArray=Array.from(window.app.world.changedBlocksMap);//this is stored for continue without reload
                window.app.changedBlocksDataArray=Array.from(window.app.world.changedBlocksDataMap);
                let blocks=new TextEncoder("utf-8").encode(JSON.stringify(window.app.changedBlocksArray));
                let data=new TextEncoder("utf-8").encode(JSON.stringify(window.app.changedBlocksDataArray));
                let blockscompressed = this.pako.deflate(blocks,{chunkSize: 8192 });
                let datacompressed = this.pako.deflate(data,{chunkSize: 8192 });
                localStorage.setItem("player_x",window.app.player.x);
                localStorage.setItem("player_y",window.app.player.y);
                localStorage.setItem("player_z",window.app.player.z);
                localStorage.setItem("seed", window.app.seed);

                
                //
                (async () => {//here we store reduced data in indexdb such that it survives browser refresh and exit.
                    await set("changedBlocksMap",blockscompressed);//saving world in indexdb
                    await set("changedBlocksDataMap",datacompressed);//saving world in indexdb
                this.minecraft.loadWorld(null);
                })();

            }));
        }
        this.buttonList.push(new GuiButton("Quit to Title", this.width / 2 - 100, y + 118, 200, 20, () => {
            //this is a quickfix, as  this.minecraft.loadWorld(null); keeps changes until next reload
            setTimeout(function(){
                window.location.reload(1);
                }, 1);
        }));
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Background
        this.drawRect(stack, 0, 0, this.width, this.height, 'black', 0.6);

        // Title
        this.drawCenteredString(stack, "Game menu", this.width / 2, 50);

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

}