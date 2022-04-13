window.EntityRenderer = class {

    constructor(model) {
        this.model = model;
    }

    rebuild(tessellator, entity) {
        this.model.rebuild(tessellator, entity);
    }

    render(entity) {
        this.model.render(0);
    }

}