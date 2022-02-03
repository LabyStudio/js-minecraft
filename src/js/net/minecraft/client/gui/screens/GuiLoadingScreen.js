window.GuiLoadingScreen = class extends GuiScreen {

    constructor() {
        super();

        this.textureBackground = Gui.loadTexture("background.png");
    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        // Render dirt background
        this.drawBackground(stack, this.textureBackground, this.width, this.height);

        // Render title
        this.drawString(stack, this.title, this.width / 2, this.height / 2 - 20, '#FFFFFF');

        let progressWidth = 300;
        let progressHeight = 5;

        // Render background of progress
        this.drawRect(
            stack,
            this.width / 2 - progressWidth / 2,
            this.height / 2 - progressHeight / 2,
            this.width / 2 + progressWidth / 2,
            this.height / 2 + progressHeight / 2,
            '#808080',
        );

        // Render progress
        this.drawRect(
            stack,
            this.width / 2 - progressWidth / 2,
            this.height / 2 - progressHeight / 2,
            this.width / 2 - progressWidth / 2 + progressWidth * this.progress,
            this.height / 2 + progressHeight / 2,
            '#80ff80',
        );

        super.drawScreen(stack, mouseX, mouseY, partialTicks);
    }

    setTitle(title) {
        this.title = title;
    }

    setProgress(progress) {
        this.progress = progress;
    }

}