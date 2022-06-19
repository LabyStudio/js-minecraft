export default class GameProfile {

    constructor(username, uuid) {
        this.username = username;
        this.uuid = uuid;
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