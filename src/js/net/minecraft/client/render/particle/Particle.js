import Entity from "../../entity/Entity.js";
import * as THREE from "../../../../../../../libraries/three.module.js";
import Tessellator from "../Tessellator.js";

export default class Particle extends Entity {

    constructor(minecraft, world, x, y, z, motionX, motionY, motionZ) {
        super(minecraft, world);

        this.setPosition(x, y, z);

        this.textureIndex = 0;

        this.randomX = this.random.nextFloat() * 3;
        this.randomY = this.random.nextFloat() * 3;
        this.randomZ = (this.random.nextFloat() * 0.5 + 0.5) * 2.0;

        this.motionX = motionX + (Math.random() * 2 - 1.0) * 0.4;
        this.motionY = motionY + (Math.random() * 2 - 1.0) * 0.4;
        this.motionZ = motionZ + (Math.random() * 2 - 1.0) * 0.4;

        let strength = (Math.random() + Math.random() + 1.0) * 0.15;
        let length = Math.sqrt(this.motionX * this.motionX + this.motionY * this.motionY + this.motionZ * this.motionZ);
        this.motionX = (this.motionX / length) * strength * 0.4;
        this.motionY = (this.motionY / length) * strength * 0.4 + 0.1;
        this.motionZ = (this.motionZ / length) * strength * 0.4;

        this.maxTicksExisted = Math.floor(4 / (this.random.nextFloat() * 0.9 + 0.1))
        this.color = -1;

        this.group = null;
    }

    onUpdate() {
        super.onUpdate();

        if (this.ticksExisted >= this.maxTicksExisted) {
            this.kill();
        }

        this.motionY -= 0.04;

        this.moveCollide(this.motionX, this.motionY, this.motionZ);

        this.motionX *= 0.98;
        this.motionY *= 0.98;
        this.motionZ *= 0.98;

        if (this.onGround) {
            this.motionX *= 0.7;
            this.motionZ *= 0.7;
        }
    }

    render(rotationX, rotationY, rotationZ, partialTicks) {
        let x = ((this.prevX + (this.x - this.prevX) * partialTicks));
        let y = ((this.prevY + (this.y - this.prevY) * partialTicks));
        let z = ((this.prevZ + (this.z - this.prevZ) * partialTicks));

        // Create mesh
        if (this.group === null) {
            this.rebuild();
        }

        let factor = 0.1 * this.randomZ;
        this.group.scale.x = factor;
        this.group.scale.y = factor;
        this.group.scale.z = factor;

        this.group.rotation.x = rotationX;
        this.group.rotation.y = rotationY;
        this.group.rotation.z = rotationZ;

        this.group.position.x = x;
        this.group.position.y = y;
        this.group.position.z = z;
        this.group.updateMatrix();
    }

    rebuild() {
        this.group = new THREE.Object3D();
        this.group.rotation.order = 'ZYX';

        let tessellator = new Tessellator();
        tessellator.bindTexture(this.minecraft.worldRenderer.textureTerrain);

        let minU = ((this.textureIndex % 16) + this.randomX / 4) / 16.0;
        let maxU = minU + (16 / 256 / 4);
        let minV = (Math.floor(this.textureIndex / 16) + this.randomX / 4) / 16.0;
        let maxV = minV + (16 / 256 / 4);

        // Flip V
        minV = 1 - minV;
        maxV = 1 - maxV;

        let red = (this.color >> 16 & 255) / 255.0;
        let green = (this.color >> 8 & 255) / 255.0;
        let blue = (this.color & 255) / 255.0;

        let brightness = this.getEntityBrightness();

        // Render particle
        tessellator.startDrawing();
        tessellator.setColor(red * brightness, green * brightness, blue * brightness);
        tessellator.addVertexWithUV(0, 1, 0, minU, minV);
        tessellator.addVertexWithUV(0, 0, 0, minU, maxV);
        tessellator.addVertexWithUV(1, 0, 0, maxU, maxV);
        tessellator.addVertexWithUV(1, 1, 0, maxU, minV);
        let mesh = tessellator.draw(this.group);
        mesh.geometry.center();

        this.minecraft.worldRenderer.scene.add(this.group);
    }

    kill() {
        super.kill();

        if (this.group !== null) {
            this.minecraft.worldRenderer.scene.remove(this.group);
        }
    }

}