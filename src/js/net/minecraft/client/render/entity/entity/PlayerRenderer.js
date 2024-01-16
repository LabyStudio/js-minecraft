import ModelPlayer from "../../model/model/ModelPlayer.js";
import EntityRenderer from "../EntityRenderer.js";
import Block from "../../../world/block/Block.js";
import * as THREE from "../../../../../../../../libraries/three.module.js";
import MathHelper from "../../../../util/MathHelper.js";
export default class PlayerRenderer extends EntityRenderer {

    constructor(worldRenderer) {
        super(new ModelPlayer());

        this.worldRenderer = worldRenderer;

        // Load character texture
        this.textureCharacter = worldRenderer.minecraft.getThreeTexture('char.png');
        this.textureCharacter.magFilter = THREE.NearestFilter;
        this.textureCharacter.minFilter = THREE.NearestFilter;

        // First person right-hand holder
        this.handModel = null;
        this.firstPersonGroup = new THREE.Object3D();
        this.worldRenderer.overlay.add(this.firstPersonGroup);
    }

    rebuild(entity) {
        let isSelf = entity === this.worldRenderer.minecraft.player;
        let firstPerson = this.worldRenderer.minecraft.settings.thirdPersonView === 0;
        let itemId = firstPerson && isSelf ? this.worldRenderer.itemToRender : entity.inventory.getItemInSelectedSlot();
        let hasItem = itemId !== 0;

        if (firstPerson && hasItem && isSelf) {
            super.rebuild(entity);

            // Create new item group and add it to the hand
            this.firstPersonGroup.clear();
            let itemGroup = new THREE.Object3D();
            this.firstPersonGroup.add(itemGroup);

            // Render item in hand in first person
            let block = Block.getById(itemId);
            this.worldRenderer.blockRenderer.renderBlockInFirstPerson(itemGroup, block, entity.getEntityBrightness());

            // Copy material and update depth test of the item to render it always in front
            let mesh = itemGroup.children[0];
            mesh.material = mesh.material.clone();
            mesh.material.depthTest = false;
        } else {
            this.tessellator.bindTexture(this.textureCharacter);
            super.rebuild(entity);

            // Render item in hand in third person
            if (hasItem) {
                let block = Block.getById(itemId);
                let group = this.model.rightArm.bone;
                this.worldRenderer.blockRenderer.renderBlockInHandThirdPerson(group, block, entity.getEntityBrightness());
            }

            // Create first person right hand and attach it to the holder
            this.firstPersonGroup.clear();
            this.handModel = this.model.rightArm.clone();
            this.firstPersonGroup.add(this.handModel.bone);

            // Copy material and update depth test of the hand to render it always in front
            let mesh = this.handModel.bone.children[0];
            mesh.material = mesh.material.clone();
            mesh.material.depthTest = false;
        }
    }

    render(entity, partialTicks) {
        let interpolatedX = entity.prevX + (entity.x - entity.prevX) * partialTicks;
        let interpolatedY = entity.prevY + (entity.y - entity.prevY) * partialTicks;
        let interpolatedZ = entity.prevZ + (entity.z - entity.prevZ) * partialTicks;
        let interpolatedselfX = window.app.player.prevX + (window.app.player.x - window.app.player.prevX) * partialTicks;
        let interpolatedselfY = window.app.player.prevY + (window.app.player.y - window.app.player.prevY) * partialTicks;
        let interpolatedselfZ = window.app.player.prevZ + (window.app.player.z - window.app.player.prevZ) * partialTicks;

        let yaw = window.app.player.rotationYaw;

        //KSKSKS
        let canvas=window.app.ingameOverlay.window.canvasNames.getContext('2d');
        let playerpos=new THREE.Vector3(interpolatedX,interpolatedY,interpolatedZ);
        let selfpos=new THREE.Vector3(interpolatedselfX,interpolatedselfY,interpolatedselfZ);
        selfpos.sub(playerpos)

        let yawvec=new THREE.Vector2(Math.cos((yaw-90)/180*Math.PI),Math.sin((yaw-90)/180*Math.PI));
        let yawvec2=new THREE.Vector2(selfpos.x,selfpos.z);;
        
        if(selfpos.length()>0.1 )console.log(yawvec.dot(yawvec2))
        if((selfpos.length()<0.1 ||yawvec.dot(yawvec2)>0) && window.app.playerController.getNetworkHandler !== undefined ){           
            playerpos.project(window.app.worldRenderer.camera);
            var widthHalf=window.app.ingameOverlay.window.width/2;
            var heightHalf=window.app.ingameOverlay.window.height/2;
            if(window.app.clearednames){
                window.app.fontRenderer.drawString(canvas,window.app.playerController.getNetworkHandler().playerInfoMap.get( entity.uuid.toString() ).profile.username,playerpos.x*widthHalf+widthHalf,-playerpos.y*heightHalf+heightHalf,0x50ffffff) ;// 
                window.app.clearednames=false;
            } 
        }

        let swingProgress = entity.swingProgress - entity.prevSwingProgress;
        if (swingProgress < 0.0) {
            swingProgress++;
        }
        this.model.swingProgress = entity.prevSwingProgress + swingProgress * partialTicks;
        this.model.hasItemInHand = entity.inventory.getItemInSelectedSlot() !== 0;
        this.model.isSneaking = entity.isSneaking();

        // TODO find a better way
        if (entity !== this.worldRenderer.minecraft.player) {
            this.firstPersonGroup.visible = false;
        }

        super.render(entity, partialTicks);
    }

    updateFirstPerson(player) {
        // Make sure the model is created
        this.prepareModel(player);

        // Make the group visible
        this.firstPersonGroup.visible = true;
    }

    renderRightHand(player, partialTicks) {
        this.updateFirstPerson(player);

        // Set transform of renderer
        this.model.swingProgress = 0;
        this.model.hasItemInHand = false;
        this.model.isSneaking = false;
        this.model.setRotationAngles(player, 0, 0, 0, 0, 0, 0);
        this.handModel.copyTransformOf(this.model.rightArm);

        // Render hand model
        this.handModel.render();
    }

    fillMeta(entity, meta) {
        super.fillMeta(entity, meta);

        let firstPerson = this.worldRenderer.minecraft.settings.thirdPersonView === 0;

        meta.firstPerson = firstPerson;
        meta.itemInHand = firstPerson ? this.worldRenderer.itemToRender : entity.inventory.getItemInSelectedSlot();
    }

}