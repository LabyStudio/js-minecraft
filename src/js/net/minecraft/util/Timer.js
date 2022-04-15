export default class Timer {

    static MS_PER_SECOND = 1000;
    static MAX_MS_PER_UPDATE = 1000;
    static MAX_TICKS_PER_UPDATE = 100;

    /**
     * Timer to control the tick speed independently of the framerate
     *
     * @param ticksPerSecond Amount of ticks per second
     */
    constructor(ticksPerSecond) {
        // Amount of ticks per second
        this.ticksPerSecond = ticksPerSecond;

        // Last time updated in milliseconds
        this.lastTime = Date.now();

        // Scale the tick speed
        this.timeScale = 1.0;

        // Framerate of the advanceTime update
        this.fps = 0.0;

        // Passed time since last game update
        this.passedTime = 0.0;

        // The amount of ticks for the current game update.
        // It's the passed time as an integer
        this.ticks = 0;

        // The overflow of the current tick, caused by casting the passed time to an integer
        this.partialTicks = 0;
    }


    /**
     * This function calculates the amount of ticks required to reach the ticksPerSecond.
     * Call this function in the main render loop of the game
     */
    advanceTime() {
        let now = Date.now();
        let passedMs = now - this.lastTime;

        // Store nano time of this update
        this.lastTime = now;

        // Maximum and minimum
        passedMs = Math.max(0, passedMs);
        passedMs = Math.min(Timer.MAX_MS_PER_UPDATE, passedMs);

        // Calculate fps
        this.fps = Timer.MS_PER_SECOND / passedMs;

        // Calculate passed time and ticks
        this.passedTime += passedMs * this.timeScale * this.ticksPerSecond / Timer.MS_PER_SECOND;
        this.ticks = parseInt(this.passedTime);

        // Maximum ticks per update
        this.ticks = Math.min(Timer.MAX_TICKS_PER_UPDATE, this.ticks);

        // Calculate the overflow of the current tick
        this.passedTime -= this.ticks;
        this.partialTicks = this.passedTime;
    }
}