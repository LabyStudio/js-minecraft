export default class ModelBase {

    /**
     * Rebuild the model
     *
     * @param tessellator Tessellator to render vertices
     * @param group      Group to attach the built model
     */
    rebuild(tessellator, group) {

    }

    render(entity, limbSwingAmount, limbSwing, timeAlive, yaw, pitch) {
        entity.group.updateMatrix();
    }

}