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

// Texture loader
function loadTexture(textures) {
    let total = textures.length;
    let index = 0;

    document.textures = [];

    return textures.reduce((currentPromise, texturePath) => {
        return currentPromise.then(() => {
            return new Promise((resolve, reject) => {
                // Update status message
                updatePreStatus("Loading texture... " + index + "/" + total);

                // Load texture
                let image = new Image();
                image.src = "src/resources/" + texturePath;
                image.onload = () => resolve();
                document.textures[texturePath] = image;

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
        "libraries/context-filter-polyfill.min.js",

        // Minecraft Source
        "src/js/net/minecraft/util/EnumBlockFace.js",
        "src/js/net/minecraft/util/Timer.js",
        "src/js/net/minecraft/util/Random.js",
        "src/js/net/minecraft/util/EnumBlockFace.js",
        "src/js/net/minecraft/util/EnumSkyBlock.js",
        "src/js/net/minecraft/util/MetadataChunkBlock.js",
        "src/js/net/minecraft/util/Vector3.js",
        "src/js/net/minecraft/util/MovingObjectPosition.js",
        "src/js/net/minecraft/util/MathHelper.js",
        "src/js/net/minecraft/util/BoundingBox.js",
        "src/js/net/minecraft/util/Keyboard.js",
        "src/js/net/minecraft/util/BlockRenderType.js",
        "src/js/net/minecraft/client/gui/Gui.js",
        "src/js/net/minecraft/client/gui/GuiScreen.js",
        "src/js/net/minecraft/client/gui/widgets/GuiButton.js",
        "src/js/net/minecraft/client/gui/widgets/GuiKeyButton.js",
        "src/js/net/minecraft/client/gui/IngameOverlay.js",
        "src/js/net/minecraft/client/gui/screens/GuiLoadingScreen.js",
        "src/js/net/minecraft/client/gui/screens/GuiControls.js",
        "src/js/net/minecraft/client/gui/screens/GuiIngameMenu.js",
        "src/js/net/minecraft/client/GameWindow.js",
        "src/js/net/minecraft/client/sound/SoundManager.js",
        "src/js/net/minecraft/client/world/block/sound/Sound.js",
        "src/js/net/minecraft/client/world/block/Block.js",
        "src/js/net/minecraft/client/world/block/BlockStone.js",
        "src/js/net/minecraft/client/world/block/BlockGrass.js",
        "src/js/net/minecraft/client/world/block/BlockDirt.js",
        "src/js/net/minecraft/client/world/block/BlockLog.js",
        "src/js/net/minecraft/client/world/block/BlockLeave.js",
        "src/js/net/minecraft/client/world/block/BlockWater.js",
        "src/js/net/minecraft/client/world/block/BlockSand.js",
        "src/js/net/minecraft/client/world/block/BlockTorch.js",
        "src/js/net/minecraft/client/world/ChunkSection.js",
        "src/js/net/minecraft/client/world/Chunk.js",
        "src/js/net/minecraft/client/world/World.js",
        "src/js/net/minecraft/client/world/generator/NoiseGenerator.js",
        "src/js/net/minecraft/client/world/generator/noise/NoiseGeneratorPerlin.js",
        "src/js/net/minecraft/client/world/generator/noise/NoiseGeneratorOctaves.js",
        "src/js/net/minecraft/client/world/generator/noise/NoiseGeneratorCombined.js",
        "src/js/net/minecraft/client/world/generator/WorldGenerator.js",
        "src/js/net/minecraft/client/entity/Entity.js",
        "src/js/net/minecraft/client/entity/PlayerEntity.js",
        "src/js/net/minecraft/client/inventory/Inventory.js",
        "src/js/net/minecraft/client/GameSettings.js",
        "src/js/net/minecraft/client/Minecraft.js",
        "src/js/net/minecraft/client/render/isometric/IsometricRenderer.js",
        "src/js/net/minecraft/client/render/isometric/Point.js",
        "src/js/net/minecraft/client/render/isometric/TextCoord.js",
        "src/js/net/minecraft/client/render/isometric/Triangle.js",
        "src/js/net/minecraft/client/render/gui/FontRenderer.js",
        "src/js/net/minecraft/client/render/gui/ScreenRenderer.js",
        "src/js/net/minecraft/client/render/gui/ItemRenderer.js",
        "src/js/net/minecraft/client/render/Tessellator.js",
        "src/js/net/minecraft/client/render/model/ModelBase.js",
        "src/js/net/minecraft/client/render/model/renderer/Vertex.js",
        "src/js/net/minecraft/client/render/model/renderer/Polygon.js",
        "src/js/net/minecraft/client/render/model/renderer/ModelRenderer.js",
        "src/js/net/minecraft/client/render/model/model/ModelPlayer.js",
        "src/js/net/minecraft/client/render/entity/EntityRenderer.js",
        "src/js/net/minecraft/client/render/entity/entity/PlayerRenderer.js",
        "src/js/net/minecraft/client/render/entity/EntityRenderManager.js",
        "src/js/net/minecraft/client/render/WorldRenderer.js",
        "src/js/net/minecraft/client/render/BlockRenderer.js"
    ]).then(() => {
        // Remove pre status
        document.getElementById("pre-status").remove();

        // Start Minecraft
        window.app = new Minecraft("canvas-container");
    });
});