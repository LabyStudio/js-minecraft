export default class MissingPackets {

    constructor() {
        this.table = {};

        this.map(0, "ServerKeepAlivePacket");
        this.map(1, "ServerJoinGamePacket");
        this.map(2, "ServerChatPacket");
        this.map(3, "ServerUpdateTimePacket");
        this.map(4, "ServerEntityEquipmentPacket");
        this.map(5, "ServerSpawnPositionPacket");
        this.map(6, "ServerUpdateHealthPacket");
        this.map(7, "ServerRespawnPacket");
        this.map(8, "ServerPlayerPositionRotationPacket");
        this.map(9, "ServerChangeHeldItemPacket");
        this.map(10, "ServerPlayerUseBedPacket");
        this.map(11, "ServerAnimationPacket");
        this.map(12, "ServerSpawnPlayerPacket");
        this.map(13, "ServerCollectItemPacket");
        this.map(14, "ServerSpawnObjectPacket");
        this.map(15, "ServerSpawnMobPacket");
        this.map(16, "ServerSpawnPaintingPacket");
        this.map(17, "ServerSpawnExpOrbPacket");
        this.map(18, "ServerEntityVelocityPacket");
        this.map(19, "ServerDestroyEntitiesPacket");
        this.map(20, "ServerEntityMovementPacket");
        this.map(21, "ServerEntityPositionPacket");
        this.map(22, "ServerEntityRotationPacket");
        this.map(23, "ServerEntityPositionRotationPacket");
        this.map(24, "ServerEntityTeleportPacket");
        this.map(25, "ServerEntityHeadLookPacket");
        this.map(26, "ServerEntityStatusPacket");
        this.map(27, "ServerEntityAttachPacket");
        this.map(28, "ServerEntityMetadataPacket");
        this.map(29, "ServerEntityEffectPacket");
        this.map(30, "ServerEntityRemoveEffectPacket");
        this.map(31, "ServerSetExperiencePacket");
        this.map(32, "ServerEntityPropertiesPacket");
        this.map(33, "ServerChunkDataPacket");
        this.map(34, "ServerMultiBlockChangePacket");
        this.map(35, "ServerBlockChangePacket");
        this.map(36, "ServerBlockValuePacket");
        this.map(37, "ServerBlockBreakAnimPacket");
        this.map(38, "ServerMultiChunkDataPacket");
        this.map(39, "ServerExplosionPacket");
        this.map(40, "ServerPlayEffectPacket");
        this.map(41, "ServerPlaySoundPacket");
        this.map(42, "ServerSpawnParticlePacket");
        this.map(43, "ServerNotifyClientPacket");
        this.map(44, "ServerSpawnGlobalEntityPacket");
        this.map(45, "ServerOpenWindowPacket");
        this.map(46, "ServerCloseWindowPacket");
        this.map(47, "ServerSetSlotPacket");
        this.map(48, "ServerWindowItemsPacket");
        this.map(49, "ServerWindowPropertyPacket");
        this.map(50, "ServerConfirmTransactionPacket");
        this.map(51, "ServerUpdateSignPacket");
        this.map(52, "ServerMapDataPacket");
        this.map(53, "ServerUpdateTileEntityPacket");
        this.map(54, "ServerOpenTileEntityEditorPacket");
        this.map(55, "ServerStatisticsPacket");
        this.map(56, "ServerPlayerListEntryPacket");
        this.map(57, "ServerPlayerAbilitiesPacket");
        this.map(58, "ServerTabCompletePacket");
        this.map(59, "ServerScoreboardObjectivePacket");
        this.map(60, "ServerUpdateScorePacket");
        this.map(61, "ServerDisplayScoreboardPacket");
        this.map(62, "ServerTeamPacket");
        this.map(63, "ServerPluginMessagePacket");
        this.map(64, "ServerDisconnectPacket");
        this.map(65, "ServerDifficultyPacket");
        this.map(66, "ServerCombatPacket");
        this.map(67, "ServerSwitchCameraPacket");
        this.map(68, "ServerWorldBorderPacket");
        this.map(69, "ServerTitlePacket");
        this.map(70, "ServerSetCompressionPacket");
        this.map(71, "ServerPlayerListDataPacket");
        this.map(72, "ServerResourcePackSendPacket");
        this.map(73, "ServerEntityNBTUpdatePacket");
    }

    map(id, name) {
        this.table[id] = name;
    }

    get(id) {
        return this.table[id];
    }


}