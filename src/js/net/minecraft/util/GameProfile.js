export default class GameProfile {

    constructor(uuid, username) {
        this.uuid = uuid;
        this.username = username;
    }

    getCompactUUID() {
        return this.uuid.toString().replace(/-/g, "");
    }

    getId() {
        return this.uuid;
    }

    getUsername() {
        return this.username;
    }

}