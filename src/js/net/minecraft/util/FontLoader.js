let myFont = new FontFace(
    "Minecraft",
    "url(/src/resources/Minecraft-Regular.ttf.woff)"
  );
  
  myFont.load().then((font) => {
    document.fonts.add(font);
    console.log('font added');
  })
  .catch((error) => {
    console.log(error);
  });