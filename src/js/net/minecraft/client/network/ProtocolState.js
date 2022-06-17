export default class ProtocolState {
    static HANDSHAKE = -1;
    static PLAY = 0;
    static STATUS = 1;
    static LOGIN = 2;

    static getName(state) {
        switch (state) {
            case ProtocolState.HANDSHAKE:
                return "HANDSHAKE";
            case ProtocolState.LOGIN:
                return "LOGIN";
            case ProtocolState.PLAY:
                return "PLAY";
            case ProtocolState.STATUS:
                return "STATUS";
            default:
                return "UNKNOWN";
        }
    }
}