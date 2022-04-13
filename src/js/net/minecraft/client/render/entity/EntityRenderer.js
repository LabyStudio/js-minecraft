window.EntityRenderer = class {

    constructor(model) {
        this.model = model;
    }

    rebuild(tessellator, entity) {
        this.model.rebuild(tessellator, entity.group);
    }

    render(entity, partialTicks) {
        let group = entity.group;

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
        group.scale.set(scale, -scale, scale);

        // Rotate entity model
        group.rotation.y = MathHelper.toRadians(-entity.yaw + 180);

        // Render entity model
        let time = Date.now() / 100;
        this.model.render(group, time);
    }

}