import ModelRenderer from "../renderer/ModelRenderer.js";
import MathHelper from "../../../../util/MathHelper.js";
import ModelBase from "../ModelBase.js";

export default class ModelPlayer extends ModelBase {

    /**
     * Create cubes for the zombie model
     */
    constructor() {
        super();

        this.swingProgress = 0;
        this.hasItemInHand = false;
        this.isSneaking = false;

        let width = 64;
        let height = 32;

        // Create head ModelRenderer
        this.head = new ModelRenderer("head", width, height)
            .setTextureOffset(0, 0)
            .addBox(-4.0, -8.0, -4.0, 8, 8, 8);

        // Create body ModelRenderer
        this.body = new ModelRenderer("body", width, height)
            .setTextureOffset(16, 16)
            .addBox(-4.0, 0.0, -2.0, 8, 12, 4);

        // Left arm ModelRenderer
        this.leftArm = new ModelRenderer("left_arm", width, height)
            .setTextureOffset(40, 16)
            .setRotationPoint(-5.0, 2.0, 0.0)
            .addBox(-1.0, -2.0, -2.0, 4, 12, 4);

        // Right arm ModelRenderer
        this.rightArm = new ModelRenderer("right_arm", width, height)
            .setTextureOffset(40, 16)
            .setRotationPoint(-3.0, 2.0, -2.0)
            .addBox(-3.0, -2.0, -2.0, 4, 12, 4);

        // Right Legs ModelRenderer
        this.rightLeg = new ModelRenderer("right_leg", width, height)
            .setTextureOffset(0, 16)
            .setRotationPoint(-2.0, 12.0, 0.0)
            .addBox(-2.0, 0.0, -2.0, 4, 12, 4);

        // Left leg ModelRenderer
        this.leftLeg = new ModelRenderer("left_leg", width, height)
            .setTextureOffset(0, 16)
            .setRotationPoint(2.0, 12.0, 0.0)
            .addBox(-2.0, 0.0, -2.0, 4, 12, 4);
    }

    rebuild(tessellator, group) {
        super.rebuild(tessellator, group);

        this.head.rebuild(tessellator, group);
        this.body.rebuild(tessellator, group);
        this.leftArm.rebuild(tessellator, group);
        this.rightArm.rebuild(tessellator, group);
        this.leftLeg.rebuild(tessellator, group);
        this.rightLeg.rebuild(tessellator, group);
    }

    render(stack, limbSwing, limbSwingStrength, timeAlive, yaw, pitch, partialTicks) {
        this.setRotationAngles(stack, limbSwing, limbSwingStrength, timeAlive, yaw, pitch, partialTicks);

        // Render cubes
        this.head.render();
        this.body.render();
        this.rightArm.render();
        this.leftArm.render();
        this.rightLeg.render();
        this.leftLeg.render();

        super.render(stack, limbSwing, limbSwingStrength, timeAlive, yaw, pitch, partialTicks);
    }

    setRotationAngles(stack, limbSwing, limbSwingStrength, timeAlive, yaw, pitch, partialTicks) {
        // Head rotation
        this.head.rotateAngleY = MathHelper.toRadians(yaw);
        this.head.rotateAngleX = MathHelper.toRadians(pitch);

        // Limb swing leg animation
        this.rightArm.rotateAngleX = Math.cos(limbSwing * 0.6662 + Math.PI) * 2.0 * limbSwingStrength * 0.5;
        this.leftArm.rotateAngleX = Math.cos(limbSwing * 0.6662) * 2.0 * limbSwingStrength * 0.5;
        this.rightArm.rotateAngleZ = 0.0;
        this.leftArm.rotateAngleZ = 0.0;
        this.rightLeg.rotateAngleX = Math.cos(limbSwing * 0.6662) * 1.4 * limbSwingStrength;
        this.leftLeg.rotateAngleX = Math.cos(limbSwing * 0.6662 + Math.PI) * 1.4 * limbSwingStrength;
        this.rightLeg.rotateAngleY = 0.0;
        this.leftLeg.rotateAngleY = 0.0;

        // Reset arms for swing progress
        this.rightArm.rotateAngleY = 0.0;
        this.rightArm.rotateAngleZ = 0.0;
        this.leftArm.rotateAngleY = 0.0;

        // Held item animation
        if (this.hasItemInHand) {
            this.rightArm.rotateAngleX = this.rightArm.rotateAngleX * 0.5 - (Math.PI / 10);
        }

        if (this.swingProgress > -9990.0) {
            let swingProgress = this.swingProgress;

            this.body.rotateAngleY = Math.sin(Math.sqrt(swingProgress) * Math.PI * 2.0) * 0.2;

            this.rightArm.rotationPointZ = Math.sin(this.body.rotateAngleY) * 5.0;
            this.rightArm.rotationPointX = -Math.cos(this.body.rotateAngleY) * 5.0;
            this.leftArm.rotationPointZ = -Math.sin(this.body.rotateAngleY) * 5.0;
            this.leftArm.rotationPointX = Math.cos(this.body.rotateAngleY) * 5.0;

            this.rightArm.rotateAngleY += this.body.rotateAngleY;
            this.leftArm.rotateAngleY += this.body.rotateAngleY;
            this.leftArm.rotateAngleX += this.body.rotateAngleY;

            swingProgress = 1.0 - swingProgress;
            swingProgress = swingProgress * swingProgress;
            swingProgress = swingProgress * swingProgress;
            swingProgress = 1.0 - swingProgress;

            let value1 = Math.sin(swingProgress * Math.PI);
            let value2 = Math.sin(swingProgress * Math.PI) * -(this.head.rotateAngleX - 0.7) * 0.75;

            this.rightArm.rotateAngleX = (this.rightArm.rotateAngleX - (value1 * 1.2 + value2));
            this.rightArm.rotateAngleY += this.body.rotateAngleY * 2.0;
            this.rightArm.rotateAngleZ += Math.sin(swingProgress * Math.PI) * -0.4;
        }

        // Sneaking animation
        if (this.isSneaking) {
            this.body.rotateAngleX = 0.5;
            this.rightArm.rotateAngleX += 0.4;
            this.leftArm.rotateAngleX += 0.4;
            this.rightLeg.rotationPointZ = 4.0;
            this.leftLeg.rotationPointZ = 4.0;
            this.rightLeg.rotationPointY = 9.0;
            this.leftLeg.rotationPointY = 9.0;
            this.head.rotationPointY = 1.0;

            stack.translateY(-0.2);
        } else {
            this.body.rotateAngleX = 0.0;
            this.rightLeg.rotationPointZ = 0.1;
            this.leftLeg.rotationPointZ = 0.1;
            this.rightLeg.rotationPointY = 12.0;
            this.leftLeg.rotationPointY = 12.0;
            this.head.rotationPointY = 0.0;
        }

        // Limb swing arm animation
        this.rightArm.rotateAngleZ += Math.cos(timeAlive * 0.09) * 0.05 + 0.05;
        this.leftArm.rotateAngleZ -= Math.cos(timeAlive * 0.09) * 0.05 + 0.05;
        this.rightArm.rotateAngleX += Math.sin(timeAlive * 0.067) * 0.05;
        this.leftArm.rotateAngleX -= Math.sin(timeAlive * 0.067) * 0.05;
    }

}