window.ModelPlayer = class extends ModelBase {

    /**
     * Create cubes for the zombie model
     */
    constructor() {
        super();

        let width = 64;
        let height = 32;

        // Create head ModelRenderer
        this.head = new ModelRenderer(width, height)
            .setTextureOffset(0, 0)
            .setBox(-4.0, -8.0, -4.0, 8, 8, 8);

        // Create body ModelRenderer
        this.body = new ModelRenderer(width, height)
            .setTextureOffset(16, 16)
            .setBox(-4.0, 0.0, -2.0, 8, 12, 4);

        // Right arm ModelRenderer
        this.rightArm = new ModelRenderer(width, height)
            .setTextureOffset(40, 16)
            .setRotationPoint(-5.0, 2.0, 0.0)
            .setBox(-3.0, -2.0, -2.0, 4, 12, 4);

        // Left arm ModelRenderer
        this.leftArm = new ModelRenderer(width, height)
            .setTextureOffset(40, 16)
            .setRotationPoint(5.0, 2.0, 0.0)
            .setBox(-1.0, -2.0, -2.0, 4, 12, 4);

        // Right Legs ModelRenderer
        this.rightLeg = new ModelRenderer(width, height)
            .setTextureOffset(0, 16)
            .setRotationPoint(-2.0, 12.0, 0.0)
            .setBox(-2.0, 0.0, -2.0, 4, 12, 4);

        // Left leg ModelRenderer
        this.leftLeg = new ModelRenderer(width, height)
            .setTextureOffset(0, 16)
            .setRotationPoint(2.0, 12.0, 0.0)
            .setBox(-2.0, 0.0, -2.0, 4, 12, 4);
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

    render(entity, limbSwingAmount, limbSwing, timeAlive, yaw, pitch) {
        let group = entity.group;

        this.head.rotateAngleY = MathHelper.toRadians(yaw);
        this.head.rotateAngleX = MathHelper.toRadians(pitch);
        this.rightArm.rotateAngleX = Math.cos(limbSwingAmount * 0.6662 + Math.PI) * 2.0 * limbSwing * 0.5;
        this.leftArm.rotateAngleX = Math.cos(limbSwingAmount * 0.6662) * 2.0 * limbSwing * 0.5;
        this.rightArm.rotateAngleZ = 0.0;
        this.leftArm.rotateAngleZ = 0.0;
        this.rightLeg.rotateAngleX = Math.cos(limbSwingAmount * 0.6662) * 1.4 * limbSwing;
        this.leftLeg.rotateAngleX = Math.cos(limbSwingAmount * 0.6662 + Math.PI) * 1.4 * limbSwing;
        this.rightLeg.rotateAngleY = 0.0;
        this.leftLeg.rotateAngleY = 0.0;

        this.rightArm.rotateAngleY = 0.0;
        this.rightArm.rotateAngleZ = 0.0;

        if (entity.sneaking) {
            this.body.rotateAngleX = 0.5;
            this.rightArm.rotateAngleX += 0.4;
            this.leftArm.rotateAngleX += 0.4;
            this.rightLeg.rotationPointZ = 4.0;
            this.leftLeg.rotationPointZ = 4.0;
            this.rightLeg.rotationPointY = 9.0;
            this.leftLeg.rotationPointY = 9.0;
            this.head.rotationPointY = 1.0;

            group.translateY(-0.2);
        } else {
            this.body.rotateAngleX = 0.0;
            this.rightLeg.rotationPointZ = 0.1;
            this.leftLeg.rotationPointZ = 0.1;
            this.rightLeg.rotationPointY = 12.0;
            this.leftLeg.rotationPointY = 12.0;
            this.head.rotationPointY = 0.0;
        }

        this.rightArm.rotateAngleZ += Math.cos(timeAlive * 0.09) * 0.05 + 0.05;
        this.leftArm.rotateAngleZ -= Math.cos(timeAlive * 0.09) * 0.05 + 0.05;
        this.rightArm.rotateAngleX += Math.sin(timeAlive * 0.067) * 0.05;
        this.leftArm.rotateAngleX -= Math.sin(timeAlive * 0.067) * 0.05;

        // Render cubes
        this.head.render(group);
        this.body.render(group);
        this.rightArm.render(group);
        this.leftArm.render(group);
        this.rightLeg.render(group);
        this.leftLeg.render(group);

        super.render(entity, limbSwingAmount, limbSwing, timeAlive, yaw, pitch);
    }

}