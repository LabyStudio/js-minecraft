import BoundingBox from "../../util/BoundingBox.js";
import MathHelper from "../../util/MathHelper.js";
import Random from "../../util/Random.js";

export default class Entity {

    constructor(minecraft, world, id) {
        this.minecraft = minecraft;
        this.world = world;
        this.id = id;

        this.random = new Random();
        this.renderer = null;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.width = 0.0;
        this.height = 0.0;

        this.motionX = 0;
        this.motionY = 0;
        this.motionZ = 0;

        this.stepHeight = 0.0;

        this.onGround = false;

        this.rotationYaw = 0;
        this.rotationPitch = 0;

        this.prevX = 0;
        this.prevY = 0;
        this.prevZ = 0;

        this.prevRotationYaw = 0;
        this.prevRotationPitch = 0;

        this.prevDistanceWalked = 0;
        this.distanceWalked = 0;
        this.nextStepDistance = 1;

        this.ticksExisted = 0;
        this.isDead = false;

        this.serverPositionX = 0;
        this.serverPositionY = 0;
        this.serverPositionZ = 0;

        this.metaData = {};

        this.boundingBox = new BoundingBox();
        this.setPosition(this.x, this.y, this.z);
    }

    initRenderer() {
        this.renderer = this.minecraft.worldRenderer.entityRenderManager.createEntityRendererByEntity(this);
        if (this.renderer === null) {
            throw new Error("No entity renderer for entity " + this.constructor.name + " found!");
        }
    }

    setPosition(x, y, z) {
        // Update position
        this.x = x;
        this.y = y;
        this.z = z;

        // Update bounding box
        let width = this.width / 2;
        this.boundingBox = new BoundingBox(
            x - width,
            y,
            z - width,
            x + width,
            y + this.height,
            z + width
        );
    }

    setRotation(yaw, pitch) {
        this.rotationYaw = yaw % 360;
        this.rotationPitch = pitch % 360;
    }

    setTargetPositionAndRotation(x, y, z, yaw, pitch, increments) {
        this.setPosition(x, y, z);
        this.setRotation(yaw, pitch);
    }

    setPositionAndRotation(x, y, z, yaw, pitch) {
        this.prevX = this.x = x;
        this.prevY = this.y = y;
        this.prevZ = this.z = z;

        this.prevRotationYaw = this.rotationYaw = yaw;
        this.prevRotationPitch = this.rotationPitch = pitch;

        let diffYaw = (this.prevRotationYaw - yaw);
        if (diffYaw < -180) {
            this.prevRotationYaw += 360;
        }
        if (diffYaw >= 180) {
            this.prevRotationYaw -= 360;
        }

        this.setPosition(this.x, this.y, this.z);
        this.setRotation(yaw, pitch);
    }

    onUpdate() {
        this.onEntityUpdate();
    }

    onEntityUpdate() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.prevZ = this.z;

        this.prevDistanceWalked = this.distanceWalked;

        this.prevRotationPitch = this.rotationPitch;
        this.prevRotationYaw = this.rotationYaw;

        this.ticksExisted++;
    }

    getEntityBrightness() {
        let x = MathHelper.floor(this.x);
        let y = MathHelper.floor(this.y + this.getEyeHeight());
        let z = MathHelper.floor(this.z);
        return this.world.getLightBrightness(x, y, z);
    }

    getEyeHeight() {
        return this.boundingBox.height() * 0.8;
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

        // Move bounding box
        for (let aABB in boundingBoxList) {
            targetY = boundingBoxList[aABB].clipYCollide(this.boundingBox, targetY);
        }
        this.boundingBox.move(0.0, targetY, 0.0);

        for (let aABB in boundingBoxList) {
            targetX = boundingBoxList[aABB].clipXCollide(this.boundingBox, targetX);
        }
        this.boundingBox.move(targetX, 0.0, 0.0);

        for (let aABB in boundingBoxList) {
            targetZ = boundingBoxList[aABB].clipZCollide(this.boundingBox, targetZ);
        }
        this.boundingBox.move(0.0, 0.0, targetZ);

        this.onGround = originalTargetY !== targetY && originalTargetY < 0.0;

        // Stop motion on collision
        if (originalTargetX !== targetX) {
            this.motionX = 0.0;
        }
        if (originalTargetY !== targetY) {
            this.motionY = 0.0;
        }
        if (originalTargetZ !== targetZ) {
            this.motionZ = 0.0;
        }

        // Update position
        this.x = (this.boundingBox.minX + this.boundingBox.maxX) / 2.0;
        this.y = this.boundingBox.minY;
        this.z = (this.boundingBox.minZ + this.boundingBox.maxZ) / 2.0;

        // Horizontal collision?
        return originalTargetX !== targetX || originalTargetZ !== targetZ;
    }

    kill() {
        this.isDead = true;
    }

    isMoving() {
        return this.motionX !== 0.0
            || this.motionY !== 0.0 && !this.onGround
            || this.motionZ !== 0.0
            || this.rotationYaw !== this.prevRotationYaw
            || this.rotationPitch !== this.prevRotationPitch;
    }

    isSneaking() {
        return this.getFlag(1);
    }

    setSneaking(sneaking) {
        this.setFlag(1, sneaking);
    }

    updateMetaData(metaData) {
        for (const [id, value] of Object.entries(metaData)) {
            this.metaData[value.id] = value;
        }
    }

    getFlag(flag) {
        return typeof this.metaData[0] !== "undefined" && (this.metaData[0].value & 1 << flag) !== 0;
    }

    setFlag(flag, value) {
        if (typeof this.metaData[0] === "undefined") {
            this.metaData[0] = {id: 0, type: 0, value: 0};
        }

        if (value) {
            this.metaData[0].value |= 1 << flag;
        } else {
            this.metaData[0].value &= ~(1 << flag);
        }
    }

}