window.EntityRenderManager = class {

    constructor() {
        this.renderers = [];
        this.push(PlayerEntity, new PlayerRenderer());
    }

    push(entityType, entityRenderer) {
        this.renderers[entityType.name] = entityRenderer;
    }

    getEntityRendererByEntity(entity) {
        return this.renderers[entity.constructor.name];
    }
}