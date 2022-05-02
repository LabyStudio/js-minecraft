export default class ModelBase {

    /**
     * Rebuild the model
     *
     * @param tessellator Tessellator to render vertices
     * @param group      Group to attach the built model
     */
    rebuild(tessellator, group) {

    }

    render(stack, limbSwing, limbSwingStrength, timeAlive, yaw, pitch, partialTicks) {
        stack.updateMatrix();
    }

    setRotationAngles(stack, limbSwing, limbSwingStrength, timeAlive, yaw, pitch, partialTicks) {

    }

}