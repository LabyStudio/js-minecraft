window.PlayerRenderer = class extends EntityRenderer {

    constructor() {
        super(new ModelPlayer());

        // Load character texture
        this.textureCharacter = new THREE.TextureLoader().load('src/resources/char.png');
        this.textureCharacter.magFilter = THREE.NearestFilter;
        this.textureCharacter.minFilter = THREE.NearestFilter;
    }

    rebuild(tessellator, entity) {
        tessellator.bindTexture(this.textureCharacter);
        super.rebuild(tessellator, entity);
    }

    render(entity) {
        super.render(entity);

    }

}