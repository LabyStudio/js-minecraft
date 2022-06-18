import GuiScreen from "../GuiScreen.js";
import GuiButton from "../widgets/GuiButton.js";
import GuiOptions from "./GuiOptions.js";
import * as THREE from "../../../../../../../libraries/three.module.js";
import {BackSide} from "../../../../../../../libraries/three.module.js";
import MathHelper from "../../../util/MathHelper.js";
import Minecraft from "../../Minecraft.js";
import GuiCreateWorld from "./GuiCreateWorld.js";
import GuiDirectConnect from "./GuiDirectConnect.js";

export default class GuiMainMenu extends GuiScreen {

    constructor() {
        super();

        this.panoramaTimer = 0;
        this.splashText = "Minecraft written in JavaScript!";
    }

    init() {
        super.init();
        this.textureLogo = this.getTexture("gui/title/minecraft.png");

        let y = this.height / 4 + 48;

        this.buttonList.push(new GuiButton("Singleplayer", this.width / 2 - 100, y, 200, 20, () => {
            this.minecraft.displayScreen(new GuiCreateWorld(this));
        }));
        this.buttonList.push(new GuiButton("Multiplayer", this.width / 2 - 100, y + 24, 200, 20, () => {
            this.minecraft.displayScreen(new GuiDirectConnect(this));
        }));
        this.buttonList.push(new GuiButton("Minecraft Realms", this.width / 2 - 100, y + 24 * 2, 200, 20, () => {

        }).setEnabled(false));
        this.buttonList.push(new GuiButton("Options...", this.width / 2 - 100, y + 72 + 12, 98, 20, () => {
            this.minecraft.displayScreen(new GuiOptions(this));
        }));
        this.buttonList.push(new GuiButton("Quit Game", this.width / 2 + 2, y + 72 + 12, 98, 20, () => {
            this.minecraft.stop();
        }));

        this.initPanoramaRenderer();
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        let logoWidth = 274;
        let x = this.width / 2 - logoWidth / 2;
        let y = 30;

        let rotationX = Math.sin((this.panoramaTimer + partialTicks) / 400.0) * 25.0 + 20.0;
        let rotationY = -(this.panoramaTimer + partialTicks) * 0.1;

        // Draw panorama
        this.camera.aspect = this.width / this.height;
        this.camera.rotation.x = -MathHelper.toRadians(rotationX + 180);
        this.camera.rotation.y = -MathHelper.toRadians(rotationY - 180);
        this.camera.updateProjectionMatrix();
        this.minecraft.worldRenderer.webRenderer.clear();
        this.minecraft.worldRenderer.webRenderer.render(this.scene, this.camera);

        // Draw panorama overlay
        this.drawGradientRect(stack, 0, 0, this.width, this.height, 'rgba(255,255,255,0.5)', 'rgb(255,255,255,0)');
        this.drawGradientRect(stack, 0, 0, this.width, this.height, 'rgb(0,0,0,0)', 'rgb(0,0,0,0.5)');

        // Draw logo
        this.drawLogo(stack, x, y);

        // Draw version
        this.drawString(stack, "js-minecraft " + Minecraft.VERSION, 2, this.height - 10, 0xFFFFFFff);

        // Draw copyright
        let mouseOver = mouseX > this.width / 2 + 70 && mouseY > this.height - 20;
        this.drawRightString(stack, "GitHub @LabyStudio/js-minecraft", this.width - 2, this.height - 10, mouseOver ? 0xFF00FFFF : 0xFFFFFFff);

        // Draw buttons
        super.drawScreen(stack, mouseX, mouseY, partialTicks);

        // Draw splash text
        this.drawSplash(stack);
    }

    updateScreen() {
        this.panoramaTimer++;
    }

    drawLogo(stack, x, y) {
        this.drawSprite(stack, this.textureLogo, 0, 0, 155, 44, x, y, 155, 44);
        this.drawSprite(stack, this.textureLogo, 0, 45, 155, 44, x + 155, y, 155, 44);
    }

    drawSplash(stack) {
        let f = 1.8 - Math.abs(Math.sin((new Date().getTime() % 1000) / 1000.0 * Math.PI * 2.0) * 0.1);
        f = f * 100.0 / (this.getStringWidth(stack, this.splashText) + 32);

        stack.save();
        stack.translate((this.width / 2 + 90), 70.0, 0.0);
        stack.rotate(MathHelper.toRadians(-20));
        stack.scale(f, f, f);

        this.drawCenteredString(stack, this.splashText, 0, -8, -256);
        stack.restore();
    }

    keyTyped(key) {
        // Cancel key inputs
    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        super.mouseClicked(mouseX, mouseY, mouseButton);

        // Click on GitHub text
        let mouseOver = mouseX > this.width / 2 + 70 && mouseY > this.height - 20;
        if (mouseOver) {
            this.minecraft.window.openUrl(Minecraft.URL_GITHUB, true);
        }
    }

    initPanoramaRenderer() {
        this.scene = new THREE.Scene();

        // Create cube
        let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        let materials = [
            new THREE.MeshBasicMaterial({
                side: BackSide,
                map: this.minecraft.getThreeTexture("gui/title/background/panorama_1.png")
            }),
            new THREE.MeshBasicMaterial({
                side: BackSide,
                map: this.minecraft.getThreeTexture("gui/title/background/panorama_3.png")
            }),
            new THREE.MeshBasicMaterial({
                side: BackSide,
                map: this.minecraft.getThreeTexture("gui/title/background/panorama_4.png")
            }),
            new THREE.MeshBasicMaterial({
                side: BackSide,
                map: this.minecraft.getThreeTexture("gui/title/background/panorama_5.png")
            }),
            new THREE.MeshBasicMaterial({
                side: BackSide,
                map: this.minecraft.getThreeTexture("gui/title/background/panorama_0.png")
            }),
            new THREE.MeshBasicMaterial({
                side: BackSide,
                map: this.minecraft.getThreeTexture("gui/title/background/panorama_2.png")
            })
        ];

        materials.forEach(material => {
            material.map.minFilter = THREE.LinearFilter;
            material.map.magFilter = THREE.LinearFilter;
        });

        let cube = new THREE.Mesh(geometry, materials);
        cube.scale.set(-1, -1, -1);
        this.scene.add(cube);

        this.camera = new THREE.PerspectiveCamera(120, 1, 0.1, 1);
        this.camera.rotation.order = 'ZYX';

        // Apply blur
        let style = this.minecraft.window.canvas.style;
        style.backdropFilter = "blur(10px)";
        style.webkitBackdropFilter = "blur(10px)";
        this.minecraft.window.wrapper.insertBefore(this.minecraft.window.canvasWorld, this.minecraft.window.canvas);
    }

    onClose() {
        // Remove blur
        let style = this.minecraft.window.canvas.style;
        style.backdropFilter = "";
        style.webkitBackdropFilter = "";
        this.minecraft.window.wrapper.removeChild(this.minecraft.window.canvasWorld);
    }
}