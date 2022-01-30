window.GameWindow = class {

    constructor(renderer, canvasWrapperId) {
        this.renderer = renderer;
        this.canvasWrapperId = canvasWrapperId;

        // Add web renderer canvas to wrapper
        document.getElementById(this.canvasWrapperId).appendChild(renderer.canvasElement);

        // Init
        this.initialize();

        // On resize
        let scope = this;
        window.addEventListener('resize', _ => scope.initialize(), false);
    }


    initialize() {
        // Get canvas size
        let canvasElement = document.getElementById(this.canvasWrapperId);
        this.canvasWidth = canvasElement.offsetWidth;
        this.canvasHeight = canvasElement.offsetHeight;

        // Adjust camera
        this.renderer.camera.aspect = this.canvasWidth / this.canvasHeight;
        this.renderer.camera.updateProjectionMatrix();
        this.renderer.webRenderer.setSize(this.canvasWidth, this.canvasHeight);
    }
}