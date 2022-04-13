window.EntityLiving = class extends Entity {

    constructor(minecraft, world) {
        super(minecraft, world);

        this.jumpTicks = 0;

        this.jumping = false;

        this.moveForward = 0.0;
        this.moveStrafing = 0.0;
    }

    onUpdate() {
        super.onUpdate();
        this.onLivingUpdate();

        while (this.renderYawOffset - this.prevRenderYawOffset < -180.0) {
            this.prevRenderYawOffset -= 360.0;
        }

        while (this.renderYawOffset - this.prevRenderYawOffset >= 180.0) {
            this.prevRenderYawOffset += 360.0;
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
    }

    onEntityUpdate() {
        this.prevRenderYawOffset = this.renderYawOffset;

        super.onEntityUpdate();

    }

}