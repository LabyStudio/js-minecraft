window.Entity = class {

    constructor(minecraft, world) {
        this.minecraft = minecraft;
        this.world = world;

        this.group = new THREE.Object3D();

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.motionX = 0;
        this.motionY = 0;
        this.motionZ = 0;

        this.onGround = false;

        this.sneaking = false;

        this.yaw = 0;
        this.pitch = 0;
        this.renderYawOffset = 0;

        this.prevX = 0;
        this.prevY = 0;
        this.prevZ = 0;

        this.prevYaw = 0;
        this.prevPitch = 0;
        this.prevRenderYawOffset = 0;

        this.distanceWalked = 0;
        this.nextStepDistance = 1;
    }

    onUpdate() {
        this.onEntityUpdate();
    }

    onEntityUpdate() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.prevZ = this.z;

        this.prevPitch = this.pitch;
        this.prevYaw = this.yaw;
    }

}