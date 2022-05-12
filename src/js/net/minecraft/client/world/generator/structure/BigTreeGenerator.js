import Generator from "../Generator.js";
import {BlockRegistry} from "../../block/BlockRegistry.js";

export default class BigTreeGenerator extends Generator {

    constructor(world, seed) {
        super(world, seed);

        this.heightLimit = 0;
        this.heightAttenuation = 0.617;
        this.branchSlope = 0.381;
        this.scaleWidth = 1.0;
        this.leafDensity = 1.0;
        this.trunkSize = 1;
        this.heightLimitLimit = 12;
        this.offsetY = 4;

        this.coords = []
        this.types = [2, 0, 0, 1, 2, 1]
        this.nodes = [];
    }

    generateAtBlock(x, y, z) {
        let seed = this.random.nextLong();
        this.random.setSeed(seed);

        this.coords[0] = x;
        this.coords[1] = y;
        this.coords[2] = z;

        if (this.heightLimit === 0) {
            this.heightLimit = 5 + this.random.nextInt(this.heightLimitLimit);
        }

        if (!this.validTreeLocation()) {
            return false;
        } else {
            this.generateLeafNodeList();
            this.generateLeafNodes();
            this.generateTrunk();
            this.generateLeafNodeBases();
            return true;
        }
    }

    validTreeLocation() {
        let minCoords = [this.coords[0], this.coords[1], this.coords[2]];
        let maxCoords = [this.coords[0], (this.coords[1] + this.heightLimit) - 1, this.coords[2]];

        let typeId = this.world.getBlockAt(this.coords[0], this.coords[1] - 1, this.coords[2]);
        if (typeId !== 2 && typeId !== 3) {
            return false;
        }

        let blockLine = this.checkBlockLine(minCoords, maxCoords);
        if (blockLine === -1) {
            return true;
        }

        if (blockLine < 6) {
            return false;
        } else {
            this.heightLimit = blockLine;
            return true;
        }
    }

    checkBlockLine(minCoords, maxCoords) {
        let dimension = [0, 0, 0]
        let index = 0;

        // Find target index for dimension
        let targetIndex = 0;
        for (; index < 3; index++) {
            dimension[index] = maxCoords[index] - minCoords[index];
            if (Math.abs(dimension[index]) > Math.abs(dimension[targetIndex])) {
                targetIndex = index;
            }
        }

        // Invalid dimension
        if (dimension[targetIndex] === 0) {
            return -1;
        }

        // Get dimension index by target index
        let widthIndex = this.types[targetIndex];
        let heightIndex = this.types[targetIndex + 3];

        // Determine offset
        let offset;
        if (dimension[targetIndex] > 0) {
            offset = 1;
        } else {
            offset = -1;
        }

        // Get width and height
        let width = dimension[widthIndex] / dimension[targetIndex];
        let height = dimension[heightIndex] / dimension[targetIndex];

        let indexBlock = 0;
        let breakIndex = dimension[targetIndex] + offset;

        do {
            if (indexBlock === breakIndex) {
                break;
            }

            let coords = [0, 0, 0]
            coords[targetIndex] = minCoords[targetIndex] + indexBlock;
            coords[widthIndex] = Math.floor(minCoords[widthIndex] + indexBlock * width);
            coords[heightIndex] = Math.floor(minCoords[heightIndex] + indexBlock * height);

            // Check for collision with objects except leaves
            let typeId = this.world.getBlockAt(coords[0], coords[1], coords[2]);
            if (typeId !== 0 && typeId !== BlockRegistry.LEAVE.getId()) {
                break;
            }

            indexBlock += offset;
        } while (true);

        if (indexBlock === breakIndex) {
            return -1;
        } else {
            return Math.abs(indexBlock);
        }
    }

    generateLeafNodeList() {
        this.height = Math.floor(this.heightLimit * this.heightAttenuation);
        if (this.height >= this.heightLimit) {
            this.height = this.heightLimit - 1;
        }

        let spheres = Math.floor(1.38 + Math.pow((this.leafDensity * this.heightLimit) / 13, 2));
        if (spheres < 1) {
            spheres = 1;
        }

        // Create 2D array with max possible nodes
        let array = [];
        for (let i = 0; i < spheres * this.heightLimit; i++) {
            array[i] = [];
        }

        let minY = (this.coords[1] + this.heightLimit) - this.offsetY;
        let maxY = this.coords[1] + this.height;

        // Start point
        let y = minY - this.coords[1];

        // Fill array
        array[0][0] = this.coords[0]; // x
        array[0][1] = minY;
        array[0][2] = this.coords[2]; // z
        array[0][3] = maxY;

        // Shift
        minY--;

        let nodeIndex = 1;
        while (y >= 0) {
            let sphereIndex = 0;
            let size = this.layerSize(y);

            if (size < 0.0) {
                minY--;
                y--;
            } else {
                let offsetXZ = 0.5;

                // Create multiple spheres (nodes)
                for (; sphereIndex < spheres; sphereIndex++) {
                    let finalSize = this.scaleWidth * (size * (this.random.nextFloat() + 0.328));
                    let rotation = this.random.nextFloat() * 2 * Math.PI;

                    let x = Math.floor(finalSize * Math.sin(rotation) + this.coords[0] + offsetXZ);
                    let z = Math.floor(finalSize * Math.cos(rotation) + this.coords[2] + offsetXZ);

                    let from = [x, minY, z];
                    let to = [x, minY + this.offsetY, z];

                    // Check if node is in a valid spot
                    if (this.checkBlockLine(from, to) !== -1) {
                        continue;
                    }

                    let coords = [this.coords[0], this.coords[1], this.coords[2]];
                    let factor = Math.sqrt(Math.pow(Math.abs(this.coords[0] - from[0]), 2) + Math.pow(Math.abs(this.coords[2] - from[2]), 2));
                    let slope = factor * this.branchSlope;

                    if (from[1] - slope > maxY) {
                        coords[1] = maxY;
                    } else {
                        coords[1] = Math.floor(from[1] - slope);
                    }

                    // Fill nodes
                    if (this.checkBlockLine(coords, from) === -1) {
                        array[nodeIndex][0] = x;
                        array[nodeIndex][1] = minY;
                        array[nodeIndex][2] = z;
                        array[nodeIndex][3] = coords[1];
                        nodeIndex++;
                    }
                }

                minY--;
                y--;
            }
        }

        // Store nodes
        this.nodes = [];
        for (let i = 0; i < nodeIndex; i++) {
            this.nodes[i] = array[i];
        }
    }

    layerSize(y) {
        if (y < this.heightLimit * 0.29) {
            return -1.618;
        }

        let halfY = this.heightLimit / 2.0;
        let distance = this.heightLimit / 2.0 - y;

        let size;
        if (distance === 0.0) {
            size = halfY;
        } else if (Math.abs(distance) >= halfY) {
            size = 0.0;
        } else {
            size = Math.sqrt(Math.pow(Math.abs(halfY), 2) - Math.pow(Math.abs(distance), 2));
        }

        size *= 0.5;
        return size;
    }


    generateLeafNode(x, y, z) {
        for (let startY = y; startY < y + this.offsetY; startY++) {
            let size = this.leafSize(startY - y);
            this.generateNodeByType(x, startY, z, size, 1, BlockRegistry.LEAVE.getId());
        }
    }

    leafSize(y) {
        if (y < 0 || y >= this.offsetY) {
            return -1;
        }
        return y !== 0 && y !== this.offsetY - 1 ? 3 : 2.0;
    }

    generateNodeByType(x, y, z, size, type, typeId) {
        let actualSize = Math.floor(size + 0.618);
        let typeIndex1 = this.types[type];
        let typeIndex2 = this.types[type + 3];

        let origin = [x, y, z];
        let coords = [0, 0, 0];
        coords[type] = origin[type];

        for (let i = -actualSize; i <= actualSize; i++) {
            coords[typeIndex1] = origin[typeIndex1] + i;

            for (let radius = -actualSize; radius <= actualSize;) {
                let distance = Math.sqrt(Math.pow(Math.abs(i) + 0.5, 2) + Math.pow(Math.abs(radius) + 0.5, 2));

                if (distance > size) {
                    radius++;
                } else {
                    coords[typeIndex2] = origin[typeIndex2] + radius;

                    let typeAt = this.world.getBlockAt(coords[0], coords[1], coords[2]);
                    if (typeAt !== 0 && typeAt !== BlockRegistry.LEAVE.getId()) {
                        radius++;
                    } else {
                        this.world.setBlockAt(coords[0], coords[1], coords[2], typeId);
                        radius++;
                    }
                }
            }
        }
    }

    generateLeafNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            let x = this.nodes[i][0];
            let y = this.nodes[i][1];
            let z = this.nodes[i][2];
            this.generateLeafNode(x, y, z);
        }
    }

    generateTrunk() {
        let x = this.coords[0];
        let minY = this.coords[1];
        let maxY = this.coords[1] + this.height;
        let z = this.coords[2];

        let coordsMin = [x, minY, z];
        let coordsMax = [x, maxY, z];

        // Place normal trunk blocks
        let logTypeId = BlockRegistry.LOG.getId();
        this.setBlocks(coordsMin, coordsMax, logTypeId);

        // Increase trunk size
        if (this.trunkSize === 2) {
            coordsMin[0]++;
            coordsMax[0]++;
            this.setBlocks(coordsMin, coordsMax, logTypeId);
            coordsMin[2]++;
            coordsMax[2]++;
            this.setBlocks(coordsMin, coordsMax, logTypeId);
            coordsMin[0]--;
            coordsMax[0]--;
            this.setBlocks(coordsMin, coordsMax, logTypeId);
        }
    }

    setBlocks(minCoords, maxCoords, typeId) {
        let coords = [0, 0, 0];
        let index = 0;

        // Find target index for dimension
        let targetIndex = 0;
        for (; index < 3; index++) {
            coords[index] = maxCoords[index] - minCoords[index];
            if (Math.abs(coords[index]) > Math.abs(coords[targetIndex])) {
                targetIndex = index;
            }
        }

        // Invalid dimension
        if (coords[targetIndex] === 0) {
            return;
        }

        // Get dimension index by target index
        let widthIndex = this.types[targetIndex];
        let heightIndex = this.types[targetIndex + 3];

        let offset;
        if (coords[targetIndex] > 0) {
            offset = 1;
        } else {
            offset = -1;
        }

        let width = coords[widthIndex] / coords[targetIndex];
        let height = coords[heightIndex] / coords[targetIndex];

        // Fill area with blocks
        for (let indexBlock = 0; indexBlock !== coords[targetIndex] + offset; indexBlock += offset) {
            let coords2 = [0, 0, 0];
            coords2[targetIndex] = Math.floor((minCoords[targetIndex] + indexBlock) + 0.5);
            coords2[widthIndex] = Math.floor(minCoords[widthIndex] + indexBlock * width + 0.5);
            coords2[heightIndex] = Math.floor(minCoords[heightIndex] + indexBlock * height + 0.5);
            this.world.setBlockAt(coords2[0], coords2[1], coords2[2], typeId);
        }
    }

    generateLeafNodeBases() {
        let length = this.nodes.length;
        let minCoords = [this.coords[0], this.coords[1], this.coords[2]];

        for (let i = 0; i < length; i++) {
            let node = this.nodes[i];
            let maxCoords = [node[0], node[1], node[2]];

            // Override y coordinate
            minCoords[1] = node[3];

            // Set log in middle of sphere
            let y = minCoords[1] - this.coords[1];
            if (this.leafNodeNeedsBase(y)) {
                this.setBlocks(minCoords, maxCoords, BlockRegistry.LOG.getId());
            }
        }
    }

    leafNodeNeedsBase(y) {
        return y >= this.heightLimit * 0.2;
    }

}