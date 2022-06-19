import BlockRenderType from "../../../util/BlockRenderType.js";
import EnumBlockFace from "../../../util/EnumBlockFace.js";
import MovingObjectPosition from "../../../util/MovingObjectPosition.js";
import BoundingBox from "../../../util/BoundingBox.js";

export default class Block {

    static blocks = new Map();

    static sounds = {};

    constructor(id, textureSlotId = id) {
        this.id = id;
        this.textureSlotId = textureSlotId;

        // Bounding box
        this.boundingBox = new BoundingBox(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);

        // Default sound
        this.sound = Block.sounds.stone;

        // Register block
        Block.blocks.set(id, this);
    }

    getId() {
        return this.id;
    }

    getRenderType() {
        return BlockRenderType.BLOCK;
    }

    getParticleTextureFace() {
        return EnumBlockFace.TOP;
    }

    getTextureForFace(face) {
        return this.textureSlotId;
    }

    getTransparency() {
        return 0.0;
    }

    isTranslucent() {
        return this.getTransparency() > 0.0;
    }

    shouldRenderFace(world, x, y, z, face) {
        let typeId = world.getBlockAtFace(x, y, z, face);
        if (typeId === 0) {
            return true;
        }

        let block = Block.getById(typeId);
        return block === null || block.isTranslucent();
    }

    getColor(world, x, y, z, face) {
        return 0xffffff;
    }

    getParticleColor(world, x, y, z) {
        return this.getColor(world, x, y, z, this.getParticleTextureFace());
    }

    getLightValue() {
        return 0;
    }

    isSolid() {
        return true;
    }

    getOpacity() {
        return 1.0;
    }

    canInteract() {
        return true;
    }

    isLiquid() {
        return false;
    }

    getSound() {
        return this.sound;
    }

    getBoundingBox(world, x, y, z) {
        return this.boundingBox;
    }

    onBlockAdded(world, x, y, z) {

    }

    onBlockPlaced(world, x, y, z, face) {

    }

    collisionRayTrace(world, x, y, z, start, end) {
        start = start.addVector(-x, -y, -z);
        end = end.addVector(-x, -y, -z);

        let vec3 = start.getIntermediateWithXValue(end, this.boundingBox.minX);
        let vec31 = start.getIntermediateWithXValue(end, this.boundingBox.maxX);
        let vec32 = start.getIntermediateWithYValue(end, this.boundingBox.minY);
        let vec33 = start.getIntermediateWithYValue(end, this.boundingBox.maxY);
        let vec34 = start.getIntermediateWithZValue(end, this.boundingBox.minZ);
        let vec35 = start.getIntermediateWithZValue(end, this.boundingBox.maxZ);

        if (!this.isVecInsideYZBounds(vec3)) {
            vec3 = null;
        }

        if (!this.isVecInsideYZBounds(vec31)) {
            vec31 = null;
        }

        if (!this.isVecInsideXZBounds(vec32)) {
            vec32 = null;
        }

        if (!this.isVecInsideXZBounds(vec33)) {
            vec33 = null;
        }

        if (!this.isVecInsideXYBounds(vec34)) {
            vec34 = null;
        }

        if (!this.isVecInsideXYBounds(vec35)) {
            vec35 = null;
        }

        let vec36 = null;
        if (vec3 != null && (vec36 == null || start.squareDistanceTo(vec3) < start.squareDistanceTo(vec36))) {
            vec36 = vec3;
        }
        if (vec31 != null && (vec36 == null || start.squareDistanceTo(vec31) < start.squareDistanceTo(vec36))) {
            vec36 = vec31;
        }
        if (vec32 != null && (vec36 == null || start.squareDistanceTo(vec32) < start.squareDistanceTo(vec36))) {
            vec36 = vec32;
        }
        if (vec33 != null && (vec36 == null || start.squareDistanceTo(vec33) < start.squareDistanceTo(vec36))) {
            vec36 = vec33;
        }
        if (vec34 != null && (vec36 == null || start.squareDistanceTo(vec34) < start.squareDistanceTo(vec36))) {
            vec36 = vec34;
        }
        if (vec35 != null && (vec36 == null || start.squareDistanceTo(vec35) < start.squareDistanceTo(vec36))) {
            vec36 = vec35;
        }

        if (vec36 == null) {
            return null;
        }

        let face = null;
        if (vec36 === vec3) {
            face = EnumBlockFace.WEST;
        }
        if (vec36 === vec31) {
            face = EnumBlockFace.EAST;
        }
        if (vec36 === vec32) {
            face = EnumBlockFace.BOTTOM;
        }
        if (vec36 === vec33) {
            face = EnumBlockFace.TOP;
        }
        if (vec36 === vec34) {
            face = EnumBlockFace.NORTH;
        }
        if (vec36 === vec35) {
            face = EnumBlockFace.SOUTH;
        }
        return new MovingObjectPosition(vec36.addVector(x, y, z), face, x, y, z);
    }

    /**
     * Checks if a vector is within the Y and Z bounds of the block.
     */
    isVecInsideYZBounds(point) {
        return point == null ? false : point.y >= this.boundingBox.minY
            && point.y <= this.boundingBox.maxY
            && point.z >= this.boundingBox.minZ
            && point.z <= this.boundingBox.maxZ;
    }

    /**
     * Checks if a vector is within the X and Z bounds of the block.
     */
    isVecInsideXZBounds(point) {
        return point == null ? false : point.x >= this.boundingBox.minX
            && point.x <= this.boundingBox.maxX
            && point.z >= this.boundingBox.minZ
            && point.z <= this.boundingBox.maxZ;
    }

    /**
     * Checks if a vector is within the X and Y bounds of the block.
     */
    isVecInsideXYBounds(point) {
        return point == null ? false : point.x >= this.boundingBox.minX
            && point.x <= this.boundingBox.maxX
            && point.y >= this.boundingBox.minY
            && point.y <= this.boundingBox.maxY;
    }

    static getById(typeId) {
        let block = Block.blocks.get(typeId);
        return typeof block === "undefined" ? null : block;
    }
}

