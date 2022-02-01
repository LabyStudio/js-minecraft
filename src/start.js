// Browser test function
function isES6() {
    try {
        Function("() => {};");
        return true;
    } catch (exception) {
        return false;
    }
}

// Test for browser support
if (!isES6()) {
    alert("Your browser isn't supported! Please use another one.");
}

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

function updatePreStatus(message) {
    document.getElementById("pre-status").innerText = message;
}

// Load scripts
loadScripts([
    // Dependencies
    "libraries/three.min.js",
    "libraries/stats.min.js",

    // Minecraft Source
    "src/js/net/minecraft/util/EnumBlockFace.js",
    "src/js/net/minecraft/util/Timer.js",
    "src/js/net/minecraft/util/Random.js",
    "src/js/net/minecraft/util/Vector3.js",
    "src/js/net/minecraft/util/MovingObjectPosition.js",
    "src/js/net/minecraft/util/MathHelper.js",
    "src/js/net/minecraft/util/BoundingBox.js",
    "src/js/net/minecraft/util/Keyboard.js",
    "src/js/net/minecraft/client/GameWindow.js",
    "src/js/net/minecraft/client/world/block/Block.js",
    "src/js/net/minecraft/client/world/block/BlockStone.js",
    "src/js/net/minecraft/client/world/block/BlockGrass.js",
    "src/js/net/minecraft/client/world/block/BlockDirt.js",
    "src/js/net/minecraft/client/world/block/BlockLog.js",
    "src/js/net/minecraft/client/world/block/BlockLeave.js",
    "src/js/net/minecraft/client/world/block/BlockWater.js",
    "src/js/net/minecraft/client/world/block/BlockSand.js",
    "src/js/net/minecraft/client/world/ChunkSection.js",
    "src/js/net/minecraft/client/world/Chunk.js",
    "src/js/net/minecraft/client/world/World.js",
    "src/js/net/minecraft/client/world/generator/NoiseGenerator.js",
    "src/js/net/minecraft/client/world/generator/noise/NoiseGeneratorPerlin.js",
    "src/js/net/minecraft/client/world/generator/noise/NoiseGeneratorOctaves.js",
    "src/js/net/minecraft/client/world/generator/noise/NoiseGeneratorCombined.js",
    "src/js/net/minecraft/client/world/generator/WorldGenerator.js",
    "src/js/net/minecraft/client/entity/Player.js",
    "src/js/net/minecraft/client/Minecraft.js",
    "src/js/net/minecraft/client/render/Tessellator.js",
    "src/js/net/minecraft/client/render/WorldRenderer.js",
    "src/js/net/minecraft/client/render/BlockRenderer.js"
]).then(() => {
    // Remove pre status
    document.getElementById("pre-status").remove();

    // Start Minecraft
    window.app = new Minecraft("canvas-container");
});