window.EntityRenderer = class {

    constructor(model) {
        this.model = model;
        this.tessellator = new Tessellator();
    }

    rebuild(entity) {
        let brightness = entity.getEntityBrightness();
        entity.lastRenderedBrightness = brightness;

        // Apply brightness
        this.tessellator.setColor(brightness, brightness, brightness);

        // Rebuild
        this.model.rebuild(this.tessellator, entity.group);
    }

    render(entity, partialTicks) {
        let brightness = entity.getEntityBrightness();
        if (entity.lastRenderedBrightness !== brightness) {
            this.rebuild(entity);
        }

        let group = entity.group;

        let rotationBody = this.interpolateRotation(entity.prevRenderYawOffset, entity.renderYawOffset, partialTicks);
        let rotationHead = this.interpolateRotation(entity.prevRotationYawHead, entity.rotationYawHead, partialTicks);

        let limbSwing = entity.prevLimbSwingAmount + (entity.limbSwingAmount - entity.prevLimbSwingAmount) * partialTicks;
        let limbSwingAmount = entity.limbSwing - entity.limbSwingAmount * (1.0 - partialTicks);

        let yaw = rotationHead - rotationBody;
        let pitch = entity.prevRotationPitch + (entity.rotationPitch - entity.prevRotationPitch) * partialTicks;

        // Interpolate entity position
        let interpolatedX = entity.prevX + (entity.x - entity.prevX) * partialTicks;
        let interpolatedY = entity.prevY + (entity.y - entity.prevY) * partialTicks;
        let interpolatedZ = entity.prevZ + (entity.z - entity.prevZ) * partialTicks;

        // Translate using interpolated position
        group.position.setX(interpolatedX);
        group.position.setY(interpolatedY + 1.4);
        group.position.setZ(interpolatedZ);

        // Actual size of the entity
        let scale = 7.0 / 120.0;
        group.scale.set(-scale,- scale, scale);

        // Rotate entity model
        group.rotation.y = MathHelper.toRadians(-rotationBody + 180);

        // Render entity model
        let timeAlive = entity.ticksExisted + partialTicks;
        this.model.render(entity, limbSwingAmount, limbSwing, timeAlive, yaw, pitch, partialTicks);
    }

    interpolateRotation(prevValue, value, partialTicks) {
        let factor;
        for (factor = value - prevValue; factor < -180.0; factor += 360.0) {
        }
        while (factor >= 180.0) {
            factor -= 360.0;
        }
        return prevValue + partialTicks * factor;
    }

}