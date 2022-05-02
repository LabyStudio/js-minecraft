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

        // First person right-hand holder
        this.handModel = null;
        this.handGroup = new THREE.Object3D();
        this.worldRenderer.overlay.add(this.handGroup);
    }

    rebuild(entity) {
        this.tessellator.bindTexture(this.textureCharacter);
        super.rebuild(entity);

        // Render item in hand
        let group = this.model.rightArm.bone;
        let id = entity.inventory.getItemInSelectedSlot();
        if (id !== 0 && this.worldRenderer.minecraft.settings.thirdPersonView !== 0) {
            let block = Block.getById(id);
            this.worldRenderer.blockRenderer.renderBlockInHandThirdPerson(group, block, entity.getEntityBrightness());
        }

        // Create first person right hand and attach it to the holder
        this.handGroup.clear();
        this.handModel = this.model.rightArm.clone();
        this.handGroup.add(this.handModel.bone);

        // Copy material and update depth test of the hand
        let mesh = this.handModel.bone.children[0];
        mesh.renerOrder = 999;
        mesh.material = mesh.material.clone();
        mesh.material.depthTest = false;
        mesh.material.depthWrite = false;
    }

    render(entity, partialTicks) {
        let swingProgress = entity.swingProgress - entity.prevSwingProgress;
        if (swingProgress < 0.0) {
            swingProgress++;
        }
        this.model.swingProgress = entity.prevSwingProgress + swingProgress * partialTicks;
        this.model.hasItemInHand = entity.inventory.getItemInSelectedSlot() !== 0;
        this.model.isSneaking = entity.sneaking;

        super.render(entity, partialTicks);
    }

    renderRightArm(player, partialTicks) {
        // Make sure the model is created
        this.prepareModel(player);

        // Set transform of renderer
        this.model.swingProgress = 0;
        this.model.hasItemInHand = false;
        this.model.isSneaking = false;
        this.model.setRotationAngles(player, 0, 0, 0, 0, 0, 0);
        this.handModel.copyTransformOf(this.model.rightArm);

        // Render the model
        this.handGroup.visible = true;
        this.handModel.render();
    }

    fillMeta(entity, meta) {
        super.fillMeta(entity, meta);
        meta.itemInHand = entity.inventory.getItemInSelectedSlot();
    }

}