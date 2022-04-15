# Minecraft recode in JavaScript

This is a sandbox that provides all basic features of Minecraft.<br>
The main purpose of this project is to understand the render and physics engine of Minecraft.<br>
The source code was ported from the [java-minecraft](https://github.com/LabyStudio/java-minecraft) project.

![Ingame](.github/assets/ingame.png)<br>
Click [here](https://labystudio.github.io/js-minecraft/) for a demo!

### Feature Overview
- Block rendering
- Block collision
- Player movement
    - Walking
    - Sprinting
    - Sneaking
    - Flying
    - Swimming
- Lightning 
    - Dynamic lightning
    - Smooth lightning
    - Day/Night
    - Block light source
- Entity Rendering
    - Item in hand
    - Arm swing animation
    - Walking animation
    - Crouch animation
- World
    - 16x16x16 Chunks
    - Block type, data, sky & block lightning
    - Perlin world generation
- Camera
    - Frustum Culling
    - Fog
    - Underwater fog
    - Dynamic FOV
    - Third person
- GUI
    - Screens
        - Loading Screen
        - InGame Menu
        - Controls Screen
    - Widgets
        - Button
        - KeyBindButton
    - Overlay
        - Cross-hair
        - Font rendering
        - Hot-Bar
<hr>

# Screenshots
_Note: All textures from the original game were used for the screenshots only!_

![Loading Screen](.github/assets/loading_screen.png)
![Lightning](.github/assets/lightning.png)
![Night](.github/assets/night.png)
![Controls](.github/assets/controls.png)

### Licensing
- The main rendering library is [three.js](https://github.com/mrdoob/three.js/)
- The [stats.js](https://github.com/mrdoob/stats.js/) library is used for performance tracking
- Safari render issues fixed by [context-filter-polyfill](https://github.com/davidenke/context-filter-polyfill)
- All used sound resources are taken from [freesounds.org](https://freesound.org/people/C418/downloaded_sounds/?page=8#sound)

<hr>

NOT OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG.