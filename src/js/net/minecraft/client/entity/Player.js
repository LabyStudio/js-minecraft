window.Player = class {

    constructor(world) {
        this.world = world;

        this.prevX = 0;
        this.prevY = 0;
        this.prevZ = 0;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.motionX = 0;
        this.motionY = 0;
        this.motionZ = 0;

        this.yaw = 0;
        this.pitch = 0;

        this.onGround = false;

        this.collision = false;

        this.jumpMovementFactor = 0.02;
        this.speedInAir = 0.02;
        this.flySpeed = 0.05;
        this.stepHeight = 0.5;

        this.moveForward = 0.0;
        this.moveStrafing = 0.0;

        this.jumpTicks = 0;
        this.flyToggleTimer = 0;
        this.sprintToggleTimer = 0;

        this.jumping = false;
        this.sprinting = false;
        this.sneaking = false;
        this.flying = false;

        this.prevFovModifier = 0;
        this.fovModifier = 0;
        this.timeFovChanged = 0;

        this.resetPos();
    }

    resetPos() {
        this.setPos(0, 25, 0);
    }

    setPos(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        let w = 0.3;
        let h = 0.9;
        this.boundingBox = new BoundingBox(x - w, y - h, z - w, x + w, y + h, z + w);
    }

    turn(motionX, motionY) {
        this.yaw = this.yaw + motionX * 0.15;
        this.pitch = this.pitch - motionY * 0.15;

        if (this.pitch < -90.0) {
            this.pitch = -90.0;
        }

        if (this.pitch > 90.0) {
            this.pitch = 90.0;
        }
    }

    onTick() {
        let prevMoveForward = this.moveForward;
        let prevJumping = this.jumping;

        this.updateKeyboardInput();

        // Toggle jumping
        if (!prevJumping && this.jumping) {
            if (this.flyToggleTimer === 0) {
                this.flyToggleTimer = 7;
            } else {
                this.flying = !this.flying;
                this.flyToggleTimer = 0;

                this.updateFOVModifier();
            }
        }

        // Toggle sprint
        if (prevMoveForward === 0 && this.moveForward > 0) {
            if (this.sprintToggleTimer === 0) {
                this.sprintToggleTimer = 7;
            } else {
                this.sprinting = true;
                this.sprintToggleTimer = 0;

                this.updateFOVModifier();
            }
        }

        if (this.jumpTicks > 0) {
            --this.jumpTicks;
        }

        if (this.flyToggleTimer > 0) {
            --this.flyToggleTimer;
        }

        if (this.sprintToggleTimer > 0) {
            --this.sprintToggleTimer;
        }

        this.prevX = this.x;
        this.prevY = this.y;
        this.prevZ = this.z;

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

        this.moveStrafing *= 0.98;
        this.moveForward *= 0.98;

        if (this.flying) {
            this.travelFlying(this.moveForward, 0, this.moveStrafing);
        } else {
            if (this.isInWater()) {
                // Is inside of water
                this.travelInWater(this.moveForward, 0, this.moveStrafing);
            } else {
                // Is on land
                this.travel(this.moveForward, 0, this.moveStrafing);
            }
        }

        this.jumpMovementFactor = this.speedInAir;

        if (this.sprinting) {
            this.jumpMovementFactor = this.jumpMovementFactor + this.speedInAir * 0.3;

            if (this.moveForward <= 0 || this.collision || this.sneaking) {
                this.sprinting = false;

                this.updateFOVModifier();
            }
        }
    }

    isInWater() {
        return false;
    }

    isHeadInWater() {
        return false;
    }

    jump() {
        this.motionY = 0.42;

        if (this.sprinting) {
            let radiansYaw = this.yaw * (Math.PI / 180) + Math.PI;
            this.motionX -= Math.sin(radiansYaw) * 0.2;
            this.motionZ += Math.cos(radiansYaw) * 0.2;
        }
    }

    travelFlying(forward, vertical, strafe) {
        // Fly move up and down
        if (this.sneaking) {
            this.moveStrafing = strafe / 0.3;
            this.moveForward = forward / 0.3;
            this.motionY -= this.flySpeed * 3.0;
        }

        if (this.jumping) {
            this.motionY += this.flySpeed * 3.0;
        }

        let prevMotionY = this.motionY;
        let prevJumpMovementFactor = this.jumpMovementFactor;
        this.jumpMovementFactor = this.flySpeed * (this.sprinting ? 2 : 1);

        this.travel(forward, vertical, strafe);

        this.motionY = prevMotionY * 0.6;
        this.jumpMovementFactor = prevJumpMovementFactor;

        if (this.onGround) {
            this.flying = false;
        }
    }

    travelInWater(forward, vertical, strafe) {
        let slipperiness = 0.8;
        let friction = 0.02;

        this.moveRelative(forward, vertical, strafe, friction);
        this.collision = this.moveCollide(-this.motionX, this.motionY, -this.motionZ);

        this.motionX *= slipperiness;
        this.motionY *= 0.8;
        this.motionZ *= slipperiness;
        this.motionY -= 0.02;
    }

    travel(forward, vertical, strafe) {
        let prevSlipperiness = this.getBlockSlipperiness() * 0.91;

        let value = 0.16277136 / (prevSlipperiness * prevSlipperiness * prevSlipperiness);
        let friction;

        if (this.onGround) {
            friction = this.getAIMoveSpeed() * value;
        } else {
            friction = this.jumpMovementFactor;
        }

        this.moveRelative(forward, vertical, strafe, friction);

        // Get new speed
        let slipperiness = this.getBlockSlipperiness() * 0.91;

        // Move
        this.collision = this.moveCollide(-this.motionX, this.motionY, -this.motionZ);

        // Gravity
        if (!this.flying) {
            this.motionY -= 0.08;
        }

        // Decrease motion
        this.motionX *= slipperiness;
        this.motionY *= 0.98;
        this.motionZ *= slipperiness;
    }

    getBlockSlipperiness() {
        return this.onGround ? 0.6 : 1.0;
    }

    getAIMoveSpeed() {
        return this.sprinting ? 0.13 : 0.1;
    }

    moveRelative(forward, up, strafe, friction) {
        let distance = strafe * strafe + up * up + forward * forward;

        if (distance >= 0.0001) {
            distance = Math.sqrt(distance);

            if (distance < 1.0) {
                distance = 1.0;
            }

            distance = friction / distance;
            strafe = strafe * distance;
            up = up * distance;
            forward = forward * distance;

            let yawRadians = this.yaw * (Math.PI / 180) + Math.PI;
            let sin = Math.sin(yawRadians);
            let cos = Math.cos(yawRadians);

            this.motionX += strafe * cos - forward * sin;
            this.motionY += up;
            this.motionZ += forward * cos + strafe * sin;
        }
    }

    updateKeyboardInput() {
        let moveForward = 0.0;
        let moveStrafe = 0.0;

        let jumping = false;
        let sneaking = false;

        if (Keyboard.isKeyDown("KeyR")) { // R
            this.resetPos();
        }
        if (Keyboard.isKeyDown("KeyW")) { // W
            moveForward++;
        }
        if (Keyboard.isKeyDown("KeyS")) { // S
            moveForward--;
        }
        if (Keyboard.isKeyDown("KeyA")) { // A
            moveStrafe++;
        }
        if (Keyboard.isKeyDown("KeyD")) { // D
            moveStrafe--;
        }
        if (Keyboard.isKeyDown("Space")) { // Space
            jumping = true;
        }
        if (Keyboard.isKeyDown("ShiftLeft")) { // Shift
            if (this.moveForward > 0 && !this.sneaking && !this.sprinting && this.motionX !== 0 && this.motionZ !== 0) {
                this.sprinting = true;

                this.updateFOVModifier();
            }
        }
        if (Keyboard.isKeyDown("KeyQ")) { // Q
            sneaking = true;
        }

        if (sneaking) {
            moveStrafe = moveStrafe * 0.3;
            moveForward = moveForward * 0.3;
        }

        this.moveForward = moveForward;
        this.moveStrafing = moveStrafe;

        this.jumping = jumping;
        this.sneaking = sneaking;
    }

    moveCollide(targetX, targetY, targetZ) {
        // Target position
        let originalTargetX = targetX;
        let originalTargetY = targetY;
        let originalTargetZ = targetZ;

        if (this.onGround && this.sneaking) {
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

    getEyeHeight() {
        return this.sneaking ? 1.50 : 1.62;
    }

    updateFOVModifier() {
        let value = 1.0;

        if (this.sprinting) {
            value += 1;
        }

        if (this.flying) {
            value *= 1.1;
        }

        this.setFOVModifier((value - 1.0) * 10);
    }


    setFOVModifier(fov) {
        this.prevFovModifier = this.fovModifier;
        this.fovModifier = fov;
        this.timeFovChanged = Date.now();
    }

    getFOVModifier() {
        let timePassed = Date.now() - this.timeFovChanged;
        let distance = this.prevFovModifier - this.fovModifier;
        let duration = 100;
        let progress = distance / duration * timePassed;
        return timePassed > duration ? this.fovModifier : this.prevFovModifier - progress;
    }

    getBlockPosX() {
        return this.x - (this.x < 0 ? 1 : 0);
    }

    getBlockPosY() {
        return this.y - (this.y < 0 ? 1 : 0);
    }

    getBlockPosZ() {
        return this.z - (this.z < 0 ? 1 : 0);
    }

    getPositionEyes(partialTicks) {
        if (partialTicks === 1.0) {
            return new Vector3(this.x, this.y + this.getEyeHeight(), this.z);
        } else {
            let x = this.prevX + (this.x - this.prevX) * partialTicks;
            let y = this.prevY + (this.y - this.prevY) * partialTicks + this.getEyeHeight();
            let z = this.prevZ + (this.z - this.prevZ) * partialTicks;
            return new Vector3(x, y, z);
        }
    }

    /**
     * interpolated look vector
     */
    getLook(partialTicks) {
        // TODO interpolation
        return this.getVectorForRotation(this.pitch, this.yaw);
    }

    /**
     * Creates a Vec3 using the pitch and yaw of the entities rotation.
     */
    getVectorForRotation(pitch, yaw) {
        let z = Math.cos(-yaw * 0.017453292 - Math.PI);
        let x = Math.sin(-yaw * 0.017453292 - Math.PI);
        let xz = -Math.cos(-pitch * 0.017453292);
        let y = Math.sin(-pitch * 0.017453292);
        return new Vector3(x * xz, y, z * xz);
    }

    rayTrace(blockReachDistance, partialTicks) {
        let from = this.getPositionEyes(partialTicks);
        let direction = this.getLook(partialTicks);
        let to = from.addVector(direction.x * blockReachDistance, direction.y * blockReachDistance, direction.z * blockReachDistance);
        return this.world.rayTraceBlocks(from, to);
    }

}