window.EntityLiving = class extends Entity {

    constructor(minecraft, world) {
        super(minecraft, world);

        this.jumpTicks = 0;

        this.jumping = false;

        this.moveForward = 0.0;
        this.moveStrafing = 0.0;

        this.swingProgress = 0;
        this.prevSwingProgress = 0;
        this.swingProgressInt = 0;
        this.swingInProgress = false;

        this.renderYawOffset = 0;
        this.rotationYawHead = 0;

        this.prevRotationYawHead = 0;
        this.prevRenderYawOffset = 0;

        this.limbSwing = 0;
        this.limbSwingAmount = 0;
        this.prevLimbSwingAmount = 0;
    }

    onUpdate() {
        super.onUpdate();
        this.onLivingUpdate();

        let motionX = this.x - this.prevX;
        let motionZ = this.z - this.prevZ;

        let bodyRotation = this.renderYawOffset;

        let distanceTravelled = motionX * motionX + motionZ * motionZ;
        let distanceTravelledSqrt = 0.0;

        if (distanceTravelled > 0.0025000002) {
            distanceTravelledSqrt = Math.sqrt(distanceTravelled) * 3.0;
            bodyRotation = Math.atan2(motionZ, motionX) * 180.0 / Math.PI - 90.0;
        }

        if (this.swingProgress > 0.0) {
            bodyRotation = this.rotationYaw;
        }

        // TODO handle travel distance
        distanceTravelledSqrt = this.updateBodyRotation(bodyRotation, distanceTravelledSqrt);

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

        this.rotationYawHead = this.rotationYaw;

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

        this.prevLimbSwingAmount = this.limbSwingAmount;

        let motionX = this.x - this.prevX;
        let motionZ = this.z - this.prevZ;

        let distance = Math.sqrt(motionX * motionX + motionZ * motionZ) * 4.0;
        if (distance > 1.0) {
            distance = 1.0;
        }
        this.limbSwingAmount += (distance - this.limbSwingAmount) * 0.4;
        this.limbSwing += this.limbSwingAmount;
    }

    onEntityUpdate() {
        this.prevRenderYawOffset = this.renderYawOffset;
        this.prevRotationYawHead = this.rotationYawHead;
        this.prevSwingProgress = this.swingProgress;

        this.updateArmSwingProgress();

        super.onEntityUpdate();
    }

    updateBodyRotation(bodyRotation, distanceTravelledSqrt) {
        let bodyRotationDifference = MathHelper.wrapAngleTo180(bodyRotation - this.renderYawOffset);
        this.renderYawOffset += bodyRotationDifference * 0.3;

        let yaw = MathHelper.wrapAngleTo180(this.rotationYaw - this.renderYawOffset);
        let turn = yaw < -90.0 || yaw >= 90.0;

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
        if (turn) {
            distanceTravelledSqrt *= -1.0;
        }
        return distanceTravelledSqrt;
    }

    swingArm() {
        let swingAnimationEnd = 6;
        if (!this.isSwingInProgress || this.swingProgressInt >= swingAnimationEnd / 2 || this.swingProgressInt < 0) {
            this.swingProgressInt = -1;
            this.isSwingInProgress = true;
        }
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

}