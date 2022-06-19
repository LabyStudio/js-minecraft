export default class ChatLine {

    constructor(message) {
        this.message = message;
        this.updateCounter = 0;
    }

    getMessage() {
        return this.message;
    }
}