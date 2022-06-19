import PlayerRenderer from "./entity/PlayerRenderer.js";
import PlayerEntity from "../../entity/PlayerEntity.js";
import PlayerEntityMultiplayer from "../../entity/PlayerEntityMultiplayer.js";

export default class EntityRenderManager {

    constructor(worldRenderer) {
        this.worldRenderer = worldRenderer;

        this.renderers = [];
        this.push(PlayerEntity, PlayerRenderer);
        this.push(PlayerEntityMultiplayer, PlayerRenderer);
    }

    push(entityType, entityRenderer) {
        this.renderers[entityType.name] = entityRenderer;
    }

    createEntityRendererByEntity(entity) {
        if (!(entity.constructor.name in this.renderers)) {
            return null;
        }
        return new this.renderers[entity.constructor.name]["prototype"]["constructor"](this.worldRenderer);
    }
}