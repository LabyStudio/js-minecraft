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

        this.rotationYaw = 0;
        this.rotationPitch = 0;

        this.prevX = 0;
        this.prevY = 0;
        this.prevZ = 0;

        this.prevRotationYaw = 0;
        this.prevRotationPitch = 0;

        this.distanceWalked = 0;
        this.nextStepDistance = 1;

        this.ticksExisted = 0;
    }

    onUpdate() {
        this.onEntityUpdate();
    }

    onEntityUpdate() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.prevZ = this.z;

        this.prevRotationPitch = this.rotationPitch;
        this.prevRotationYaw = this.rotationYaw;

        this.ticksExisted++;
    }

}