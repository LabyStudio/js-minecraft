import Minecraft from './net/minecraft/client/Minecraft.js';

class Start {

    constructor(preStatusElementId) {
        this.preStatusElement = document.getElementById(preStatusElementId);
    }

    loadTextures(textures) {
        let resources = [];
        let index = 0;

        return textures.reduce((currentPromise, texturePath) => {
            return currentPromise.then(() => {
                return new Promise((resolve, reject) => {
                    // Load texture
                    let image = new Image();
                    image.src = "src/resources/" + texturePath;
                    image.onload = () => resolve();
                    resources[texturePath] = image;

                    index++;
                });
            });
        }, Promise.resolve()).then(() => {
            return resources;
        });
    }

    launch(canvasWrapperId) {
        this.loadTextures([
            "misc/grasscolor.png",
            "gui/font.png",
            "gui/gui.png",
            "gui/background.png",
            "gui/icons.png",
            "terrain/terrain.png",
            "terrain/sun.png",
            "terrain/moon.png",
            "char.png"
        ]).then((resources) => {
            this.preStatusElement.remove();

            // Launch actual game on canvas
            window.app = new Minecraft(canvasWrapperId, resources);
        });
    }
}

// Launch game
new Start("pre-status").launch("canvas-container");