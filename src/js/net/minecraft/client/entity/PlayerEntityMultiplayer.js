import PlayerEntity from "./PlayerEntity.js";
import ClientPlayerMovementPacket from "../network/packet/play/client/ClientPlayerMovementPacket.js";
import ClientPlayerRotationPacket from "../network/packet/play/client/ClientPlayerRotationPacket.js";
import ClientPlayerPositionPacket from "../network/packet/play/client/ClientPlayerPositionPacket.js";
import ClientPlayerPositionRotationPacket from "../network/packet/play/client/ClientPlayerPositionRotationPacket.js";
import ClientPlayerStatePacket from "../network/packet/play/client/ClientPlayerStatePacket.js";
import ClientSwingArmPacket from "../network/packet/play/client/ClientSwingArmPacket.js";

export default class PlayerEntityMultiplayer extends PlayerEntity {

    constructor(minecraft, world, networkHandler, id) {
        super(minecraft, world, id);

        this.networkHandler = networkHandler;

        this.positionUpdateTicks = 0;

        this.lastReportedX = 0;
        this.lastReportedY = 0;
        this.lastReportedZ = 0;

        this.lastReportedYaw = 0;
        this.lastReportedPitch = 0;

        this.serverSprintState = false;
        this.serverSneakState = false;
    }

    onUpdate() {
        super.onUpdate();
        this.onUpdateWalkingPlayer();
    }

    swingArm() {
        super.swingArm();
        this.networkHandler.sendPacket(new ClientSwingArmPacket());
    }

    onUpdateWalkingPlayer() {
        // Send sprinting to server
        let isSprinting = this.isSprinting();
        if (isSprinting !== this.serverSprintState) {
            let state = isSprinting ? ClientPlayerStatePacket.START_SPRINTING : ClientPlayerStatePacket.STOP_SPRINTING;
            this.networkHandler.sendPacket(new ClientPlayerStatePacket(this.id, state));
            this.serverSprintState = isSprinting;
        }

        // Send sneaking to server
        let isSneaking = this.isSneaking();
        if (isSneaking !== this.serverSneakState) {
            let state = isSneaking ? ClientPlayerStatePacket.START_SNEAKING : ClientPlayerStatePacket.STOP_SNEAKING;
            this.networkHandler.sendPacket(new ClientPlayerStatePacket(this.id, state));
            this.serverSneakState = isSneaking;
        }

        let movementX = this.x - this.lastReportedX;
        let movementY = this.y - this.lastReportedY;
        let movementZ = this.z - this.lastReportedZ;

        let movementYaw = this.rotationYaw - this.lastReportedYaw;
        let movementPitch = this.rotationPitch - this.lastReportedPitch;

        let reportPosition = movementX * movementX + movementY * movementY + movementZ * movementZ > 9.0E-4 || this.positionUpdateTicks >= 20;
        let reportRotation = movementYaw !== 0.0 || movementPitch !== 0.0;

        // Send position and rotation to server
        if (reportPosition && reportRotation) {
            this.networkHandler.sendPacket(new ClientPlayerPositionRotationPacket(this.onGround, this.x, this.y, this.z, this.rotationYaw, this.rotationPitch));
        } else if (reportPosition) {
            this.networkHandler.sendPacket(new ClientPlayerPositionPacket(this.onGround, this.x, this.y, this.z));
        } else if (reportRotation) {
            this.networkHandler.sendPacket(new ClientPlayerRotationPacket(this.onGround, this.rotationYaw, this.rotationPitch));
        } else {
            this.networkHandler.sendPacket(new ClientPlayerMovementPacket(this.onGround));
        }

        this.positionUpdateTicks++;

        if (reportPosition) {
            this.lastReportedX = this.x;
            this.lastReportedY = this.y;
            this.lastReportedZ = this.z;
            this.positionUpdateTicks = 0;
        }

        if (reportRotation) {
            this.lastReportedYaw = this.rotationYaw;
            this.lastReportedPitch = this.rotationPitch;
        }
    }

    getNetworkHandler() {
        return this.networkHandler;
    }

}