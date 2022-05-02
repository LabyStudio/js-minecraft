import PlayerRenderer from "./entity/PlayerRenderer.js";
import PlayerEntity from "../../entity/PlayerEntity.js";

export default class EntityRenderManager {

    constructor(worldRenderer) {
        this.worldRenderer = worldRenderer;

        this.renderers = [];
        this.push(PlayerEntity, PlayerRenderer);
    }

    push(entityType, entityRenderer) {
        this.renderers[entityType.name] = entityRenderer;
    }

    createEntityRendererByEntity(entity) {
        return new this.renderers[entity.constructor.name].prototype.constructor(this.worldRenderer);
    }
}