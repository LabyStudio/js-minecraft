export default class FocusStateType {

    static REQUEST_EXIT = new FocusStateType(0, 1);
    static EXITED = new FocusStateType(1, -1);

    static REQUEST_LOCK = new FocusStateType(2, 3);
    static LOCKED = new FocusStateType(3, -1);

    constructor(id, intentId) {
        this.id = id;
        this.intentId = intentId;
    }

    getIntent() {
        return this.intentId === -1 ? null : FocusStateType.getById(this.intentId);
    }

    isLock() {
        return this === FocusStateType.REQUEST_LOCK || this === FocusStateType.LOCKED;
    }

    isRequest() {
        return this === FocusStateType.REQUEST_LOCK || this === FocusStateType.REQUEST_EXIT;
    }

    isIntent() {
        return !this.isRequest();
    }

    opposite() {
        switch (this) {
            case FocusStateType.REQUEST_EXIT:
                return FocusStateType.REQUEST_LOCK;
            case FocusStateType.REQUEST_LOCK:
                return FocusStateType.REQUEST_EXIT;
            case FocusStateType.EXITED:
                return FocusStateType.LOCKED;
            case FocusStateType.LOCKED:
                return FocusStateType.EXITED;
            default:
                return null;
        }
    }

    getName() {
        switch (this) {
            case FocusStateType.REQUEST_EXIT:
                return "REQUEST_EXIT";
            case FocusStateType.REQUEST_LOCK:
                return "REQUEST_LOCK";
            case FocusStateType.EXITED:
                return "EXITED";
            case FocusStateType.LOCKED:
                return "LOCKED";
            default:
                return "UNKNOWN";
        }
    }

    static getById(id) {
        switch (id) {
            case 0:
                return FocusStateType.REQUEST_EXIT;
            case 1:
                return FocusStateType.EXITED;
            case 2:
                return FocusStateType.REQUEST_LOCK;
            case 3:
                return FocusStateType.LOCKED;
            default:
                return null;
        }
    }
}