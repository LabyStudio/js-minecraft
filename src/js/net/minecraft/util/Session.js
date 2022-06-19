export default class Session {

    constructor(profile, accessToken) {
        this.profile = profile;
        this.accessToken = accessToken;
    }

    getProfile() {
        return this.profile;
    }

    getAccessToken() {
        return this.accessToken;
    }

}