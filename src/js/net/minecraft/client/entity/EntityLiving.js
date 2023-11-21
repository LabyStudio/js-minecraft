import Entity from "./Entity.js";
import MathHelper from "../../util/MathHelper.js";

export default class EntityLiving extends Entity {

    constructor(minecraft, world, id) {
        super(minecraft, world, id);

        this.jumpTicks = 0;

        this.jumping = false;

        this.moveForward = 0.0;
        this.moveStrafing = 0.0;

        this.swingProgress = 0;
        this.prevSwingProgress = 0;
        this.swingProgressInt = 0;
        this.isSwingInProgress = false;

        this.renderYawOffset = 0;
        this.rotationYawHead = 0;

        this.prevRotationYawHead = 0;
        this.prevRenderYawOffset = 0;

        this.limbSwingProgress = 0;
        this.limbSwingStrength = 0;
        this.prevLimbSwingStrength = 0;

        this.health = 20.0;
    }

    onUpdate() {
        super.onUpdate();
        this.onLivingUpdate();
        this.updateBodyRotation();

        while (this.rotationYaw - this.prevRotationYaw < -180.0) {
            this.prevRotationYaw -= 360.0;
        }
        while (this.rotationYaw - this.prevRotationYaw >= 180.0) {
            this.prevRotationYaw += 360.0;
        }

        while (this.renderYawOffset - this.prevRenderYawOffset < -180.0) {
            this.prevRenderYawOffset -= 360.0;
        }
        while (this.renderYawOffset - this.prevRenderYawOffset >= 180.0) {
            this.prevRenderYawOffset += 360.0;
        }

        while (this.rotationPitch - this.prevRotationPitch < -180.0) {
            this.prevRotationPitch -= 360.0;
        }
        while (this.rotationPitch - this.prevRotationPitch >= 180.0) {
            this.prevRotationPitch += 360.0;
        }

        while (this.rotationYawHead - this.prevRotationYawHead < -180.0) {
            this.prevRotationYawHead -= 360.0;
        }
        while (this.rotationYawHead - this.prevRotationYawHead >= 180.0) {
            this.prevRotationYawHead += 360.0;
        }
    }

    onLivingUpdate() {
        if (this.jumpTicks > 0) {
            --this.jumpTicks;
        }

        if (this.rotationPositionIncrements > 0) {
            // Interpolate the position and rotation
            let x = this.x + (this.targetX - this.x) / this.rotationPositionIncrements;
            let y = this.y + (this.targetY - this.y) / this.rotationPositionIncrements;
            let z = this.z + (this.targetZ - this.z) / this.rotationPositionIncrements;

            // Update yaw and pitch
            let yaw = MathHelper.wrapAngleTo180(this.targetYaw - this.rotationYaw);
            this.rotationYaw = this.rotationYaw + yaw / this.rotationPositionIncrements;
            this.rotationPitch = (this.rotationPitch + (this.targetPitch - this.rotationPitch) / this.rotationPositionIncrements);

            // Decrement position increments
            this.rotationPositionIncrements--;

            // Update position
            this.setPosition(x, y, z);
            this.setRotation(this.rotationYaw, this.rotationPitch);
        }

        // TODO Find the right spot to update this
        this.rotationYawHead = this.rotationYaw;

        // Stop if too slow
        if (Math.abs(this.motionX) < 0.003) {
            this.motionX = 0.0;
        }
        if (Math.abs(this.motionY) < 0.003) {
            this.motionY = 0.0;
        }
        if (Math.abs(this.motionZ) < 0.003) {
            this.motionZ = 0.0;
        }

        // Jump
        if (this.jumping) {
            if (this.isInWater()) {
                this.motionY += 0.04;
            } else if (this.onGround && this.jumpTicks === 0) {
                this.jump();
                this.jumpTicks = 10;
            }
        } else {
            this.jumpTicks = 0;
        }

        this.moveForward *= 0.98;
        this.moveStrafing *= 0.98;

        this.moveEntityWithHeading(this.moveForward, this.moveStrafing);
    }

    moveEntityWithHeading(moveForward, moveStrafing) {
        if (this.flying) {
            this.travelFlying(moveForward, 0, moveStrafing);
        } else {
            if (this.isInWater()) {
                // Is inside of water
                this.travelInWater(moveForward, 0, moveStrafing);
            } else {
                // Is on land
                this.travel(moveForward, 0, moveStrafing);
            }
        }

        this.prevLimbSwingStrength = this.limbSwingStrength;

        let motionX = this.x - this.prevX;
        let motionZ = this.z - this.prevZ;

        let distance = Math.sqrt(motionX * motionX + motionZ * motionZ) * 4.0;
        if (distance > 1.0) {
            distance = 1.0;
        }
        this.limbSwingStrength += (distance - this.limbSwingStrength) * 0.4;
        this.limbSwingProgress += this.limbSwingStrength;
    }

    moveCollide(targetX, targetY, targetZ) {
        // Target position
        let originalTargetX = targetX;
        let originalTargetY = targetY;
        let originalTargetZ = targetZ;

        if (this.onGround && this.isSneaking()) {
            for (; targetX !== 0.0 && this.world.getCollisionBoxes(this.boundingBox.offset(targetX, -this.stepHeight, 0.0)).length === 0; originalTargetX = targetX) {
                if (targetX < 0.05 && targetX >= -0.05) {
                    targetX = 0.0;
                } else if (targetX > 0.0) {
                    targetX -= 0.05;
                } else {
                    targetX += 0.05;
                }
            }

            for (; targetZ !== 0.0 && this.world.getCollisionBoxes(this.boundingBox.offset(0.0, -this.stepHeight, targetZ)).length === 0; originalTargetZ = targetZ) {
                if (targetZ < 0.05 && targetZ >= -0.05) {
                    targetZ = 0.0;
                } else if (targetZ > 0.0) {
                    targetZ -= 0.05;
                } else {
                    targetZ += 0.05;
                }
            }

            for (; targetX !== 0.0 && targetZ !== 0.0 && this.world.getCollisionBoxes(this.boundingBox.offset(targetX, -this.stepHeight, targetZ)).length === 0; originalTargetZ = targetZ) {
                if (targetX < 0.05 && targetX >= -0.05) {
                    targetX = 0.0;
                } else if (targetX > 0.0) {
                    targetX -= 0.05;
                } else {
                    targetX += 0.05;
                }

                originalTargetX = targetX;

                if (targetZ < 0.05 && targetZ >= -0.05) {
                    targetZ = 0.0;
                } else if (targetZ > 0.0) {
                    targetZ -= 0.05;
                } else {
                    targetZ += 0.05;
                }
            }
        }

        // Get level tiles as bounding boxes
        let boundingBoxList = this.world.getCollisionBoxes(this.boundingBox.expand(targetX, targetY, targetZ));
        let isClimbable = false;

        // Move bounding box

        // Calculate target Y
        for (let aABB in boundingBoxList) {
            targetY = boundingBoxList[aABB].clipYCollide(this.boundingBox, targetY);
        }

        // Check if on ground
        this.onGround = originalTargetY !== targetY && originalTargetY < 0.0;

        // Calculate target X
        for (let aABB in boundingBoxList) {
            // Skip collision check for half blocks on ground
            if ((boundingBoxList[aABB].maxY - this.boundingBox.minY) <= 0.5 && (boundingBoxList[aABB].maxY - this.boundingBox.minY) > 0 && this.onGround) {
                continue;
            }
            targetX = boundingBoxList[aABB].clipXCollide(this.boundingBox, targetX);
        }

        // Calculate target Z
        for (let aABB in boundingBoxList) {
            // Skip collision check for half blocks on ground
            if ((boundingBoxList[aABB].maxY - this.boundingBox.minY) <= 0.5 && (boundingBoxList[aABB].maxY - this.boundingBox.minY) > 0 && this.onGround) {
                continue;
            }
            targetZ = boundingBoxList[aABB].clipZCollide(this.boundingBox, targetZ);
        }

        // Check for climbable blocks on ground
        if (this.onGround) {
            for (let aABB in boundingBoxList) {
                if ((boundingBoxList[aABB].maxY - this.boundingBox.minY) <= 0.5 && (boundingBoxList[aABB].maxY - this.boundingBox.minY) > 0) {
                    if (targetX == originalTargetX && boundingBoxList[aABB].clipXCollide(this.boundingBox, targetX) !== originalTargetX) {
                        isClimbable = true;
                    }
                    if (targetZ == originalTargetZ && boundingBoxList[aABB].clipZCollide(this.boundingBox, targetZ) !== originalTargetZ) {
                        isClimbable = true;
                    }
                }
            }
        }

        // Attemp to climb
        if (isClimbable && this.onGround && (targetX === originalTargetX || targetZ === originalTargetZ)) {
        
            // Move bounding box up
            this.boundingBox.move(0.0, 0.5, 0.0);

            // Calculate collision
            let isColliding = false;

            if (targetX === originalTargetX) {
                for (let aABB in boundingBoxList) {
                    targetX = boundingBoxList[aABB].clipXCollide(this.boundingBox, targetX);
                }
                if (targetX !== originalTargetX) {
                    isColliding = true;
                }
            }
            
            if (targetZ === originalTargetZ) {
                for (let aABB in boundingBoxList) {
                    targetZ = boundingBoxList[aABB].clipZCollide(this.boundingBox, targetZ);
                }
                if (targetZ !== originalTargetZ) {
                    isColliding = true;
                }
            }
            
            // Climb if block is reachable
            if (!isColliding) {
                // Recalculate target Y
                for (let aABB in boundingBoxList) {
                    targetY = boundingBoxList[aABB].clipYCollide(this.boundingBox, targetY);
                } 
            }
            else {
                this.boundingBox.move(0.0, -0.5, 0.0);
            }
        }
        
        // Move bounding box
        this.boundingBox.move(targetX, targetY, targetZ);

        // Stop motion on collision
        if (originalTargetX !== targetX) {
            this.motionX = 0.0;
            //console.log('stopX');
        }
        if (originalTargetY !== targetY) {
            this.motionY = 0.0;
            //console.log('stopY');
        }
        if (originalTargetZ !== targetZ) {
            this.motionZ = 0.0;
            //console.log('stopZ');
        }

        // Update position
        this.x = (this.boundingBox.minX + this.boundingBox.maxX) / 2.0;
        this.y = this.boundingBox.minY;
        this.z = (this.boundingBox.minZ + this.boundingBox.maxZ) / 2.0;

        // Horizontal collision?
        return originalTargetX !== targetX || originalTargetZ !== targetZ;
    }

    onEntityUpdate() {
        this.prevRenderYawOffset = this.renderYawOffset;
        this.prevRotationYawHead = this.rotationYawHead;
        this.prevSwingProgress = this.swingProgress;

        this.prevRenderArmYaw = this.renderArmYaw;
        this.prevRenderArmPitch = this.renderArmPitch;
        this.renderArmPitch = (this.renderArmPitch + (this.rotationPitch - this.renderArmPitch) * 0.5);
        this.renderArmYaw = (this.renderArmYaw + (this.rotationYaw - this.renderArmYaw) * 0.5);

        this.updateArmSwingProgress();

        super.onEntityUpdate();
    }

    updateBodyRotation() {
        let motionX = this.x - this.prevX;
        let motionZ = this.z - this.prevZ;

        let bodyRotation = this.renderYawOffset;

        let distanceTravelled = motionX * motionX + motionZ * motionZ;
        if (distanceTravelled > 0.0025000002) {
            bodyRotation = Math.atan2(motionZ, motionX) * 180.0 / Math.PI - 90.0;
        }

        if (this.swingProgress > 0.0) {
            bodyRotation = this.rotationYaw;
        }

        let bodyRotationDifference = MathHelper.wrapAngleTo180(bodyRotation - this.renderYawOffset);
        this.renderYawOffset += bodyRotationDifference * 0.3;

        let yaw = MathHelper.wrapAngleTo180(this.rotationYaw - this.renderYawOffset);
        if (yaw < -75.0) {
            yaw = -75.0;
        }
        if (yaw >= 75.0) {
            yaw = 75.0;
        }
        this.renderYawOffset = this.rotationYaw - yaw;

        if (yaw * yaw > 2500.0) {
            this.renderYawOffset += yaw * 0.2;
        }
    }

    setTargetPositionAndRotation(x, y, z, yaw, pitch, increments) {
        this.targetX = x;
        this.targetY = y;
        this.targetZ = z;
        this.targetYaw = yaw;
        this.targetPitch = pitch;
        this.rotationPositionIncrements = increments;
    }

    swingArm() {
        let swingAnimationEnd = 6;
        if (!this.isSwingInProgress || this.swingProgressInt >= swingAnimationEnd / 2 || this.swingProgressInt < 0) {
            this.swingProgressInt = -1;
            this.isSwingInProgress = true;
        }
    }
    digging(status,x,y,z,face){   
    }
    placeBlock(x,y,z,face,helditem,cursorx,cursory,cursorz,metaValue=0){
    }
    inventorySelectSlot(slot){
    }
    setItemInSelectedSlot(slot,itemid){
    }
    updateArmSwingProgress() {
        let swingAnimationEnd = 6;
        if (this.isSwingInProgress) {
            ++this.swingProgressInt;

            if (this.swingProgressInt >= swingAnimationEnd) {
                this.swingProgressInt = 0;
                this.isSwingInProgress = false;
            }
        } else {
            this.swingProgressInt = 0;
        }

        this.swingProgress = this.swingProgressInt / swingAnimationEnd;
    }

    getSwingProgress(partialTicks) {
        let swingProgressDiff = this.swingProgress - this.prevSwingProgress;
        if (swingProgressDiff < 0.0) {
            swingProgressDiff++;
        }
        return this.prevSwingProgress + swingProgressDiff * partialTicks;
    }

    computeAngleWithBound(value, subtract, limit) {
        let wrapped = MathHelper.wrapAngleTo180(value - subtract);
        if (wrapped < -limit) {
            wrapped = -limit;
        }
        if (wrapped >= limit) {
            wrapped = limit;
        }
        return value - wrapped;
    }

    setRotationYawHead(yaw) {
        this.targetYaw = yaw; // TODO should be rotationYawHead
        // this.rotationYawHead = yaw;
    }

}