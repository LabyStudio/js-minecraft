window.EntityRenderManager = class {

    constructor(worldRenderer) {
        this.worldRenderer = worldRenderer;

        this.renderers = [];
        this.push(PlayerEntity, new PlayerRenderer(worldRenderer));
    }

    push(entityType, entityRenderer) {
        this.renderers[entityType.name] = entityRenderer;
    }

    getEntityRendererByEntity(entity) {
        return this.renderers[entity.constructor.name];
    }
}