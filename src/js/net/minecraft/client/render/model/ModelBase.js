window.ModelBase = class {

    /**
     * Rebuild the model
     *
     * @param tessellator Tessellator to render vertices
     * @param group      Group to attach the built model
     */
    rebuild(tessellator, group) {

    }

    /**
     * Render the model
     *
     * @param group Group to render
     * @param time Animation offset
     */
    render(group, time) {
        group.updateMatrix();
    }

}