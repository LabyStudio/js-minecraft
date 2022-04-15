import ModelPlayer from "../../model/model/ModelPlayer.js";
import EntityRenderer from "../EntityRenderer.js";
import Block from "../../../world/block/Block.js";

export default class PlayerRenderer extends EntityRenderer {

    constructor(worldRenderer) {
        super(new ModelPlayer());

        this.worldRenderer = worldRenderer;

        // Load character texture
        this.textureCharacter = new THREE.TextureLoader().load('src/resources/char.png');
        this.textureCharacter.magFilter = THREE.NearestFilter;
        this.textureCharacter.minFilter = THREE.NearestFilter;
    }

    rebuild(entity) {
        this.tessellator.bindTexture(this.textureCharacter);
        super.rebuild(entity);

        // Render item in hand
        let group = this.model.rightArm.bone;
        let id = entity.inventory.getItemInSelectedSlot();
        if (id !== 0) {
            let block = Block.getById(id);
            this.worldRenderer.blockRenderer.renderBlockInHand(group, block, 1);
        }
    }

    render(entity, partialTicks) {
        super.render(entity, partialTicks);
    }

    fillMeta(entity, meta) {
        super.fillMeta(entity, meta);
        meta.itemInHand = entity.inventory.getItemInSelectedSlot();
    }

}