import Minecraft from './js/net/minecraft/client/Minecraft.js';

let resources = [];

// Script loader
function loadScripts(scripts) {
    let total = scripts.length;
    let index = 0;

    return scripts.reduce((currentPromise, scriptUrl) => {
        return currentPromise.then(() => {
            return new Promise((resolve, reject) => {
                // Update status message
                updatePreStatus("Loading scripts... " + index + "/" + total);

                // Load script
                let script = document.createElement('script');
                script.async = true;
                script.src = scriptUrl;
                script.onload = () => resolve();
                document.getElementsByTagName('head')[0].appendChild(script);

                index++;
            });
        });
    }, Promise.resolve());
}

// Texture loader
function loadTexture(textures) {
    let total = textures.length;
    let index = 0;

    return textures.reduce((currentPromise, texturePath) => {
        return currentPromise.then(() => {
            return new Promise((resolve, reject) => {
                // Update status message
                updatePreStatus("Loading texture... " + index + "/" + total);

                // Load texture
                let image = new Image();
                image.src = "src/resources/" + texturePath;
                image.onload = () => resolve();
                resources[texturePath] = image;

                index++;
            });
        });
    }, Promise.resolve());
}


function updatePreStatus(message) {
    document.getElementById("pre-status").innerText = message;
}

// Load textures
loadTexture([
    "misc/grasscolor.png",
    "gui/font.png",
    "gui/gui.png",
    "gui/background.png",
    "gui/icons.png",
    "terrain/terrain.png",
    "terrain/sun.png",
    "terrain/moon.png",
    "char.png"
]).then(() => {
    // Load scripts
    loadScripts([
        // Dependencies
        "libraries/three.min.js",
        "libraries/stats.min.js",
        "libraries/context-filter-polyfill.min.js"
    ]).then(() => {
        // Remove pre status
        document.getElementById("pre-status").remove();

        // Start Minecraft
        window.app = new Minecraft("canvas-container", resources);
    });
});