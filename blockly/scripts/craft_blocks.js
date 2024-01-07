import Block from "../../src/js/net/minecraft/client/world/block/Block.js"
//add https://google.github.io/blockly-samples/plugins/field-bitmap/test/index
//for texture editing
window.Block=Block;

  javascript.javascriptGenerator.forBlock['turn'] = function(block) {
    let value =  block.getFieldValue('VALUE') ;
   // return 'MusicMaker.queueSound(' + value + ');\n';
    if(value=='turnaround') return `
      _dx=-_dx;
      _dz=-_dz;
    `;
    if(value=='right') return `
      if(_dz==0) {
        _dz=_dx;
        _dx=0;
      }
      else{
        _dx=-_dz;
        _dz=0;
      }
    `
    if(value=='left') return `
      if(_dz==0) {
        _dz=-_dx;
        _dx=0;
      }
      else{
        _dx=_dz;
        _dz=0;
      }
  `;
  };

  javascript.javascriptGenerator.forBlock['forward'] = function(block) {
    return `
      _x+=_dx;
      _z+=_dz;
    `
  }
  javascript.javascriptGenerator.forBlock['back'] = function(block) {
    return `
      _x-=_dx;
      _z-=_dz;
    `
  }
  
  javascript.javascriptGenerator.forBlock['up'] = function(block) {
    return `
      _y+=1;
    `
  }
  javascript.javascriptGenerator.forBlock['down'] = function(block) {
    return `
    _y-=1;
    `
  };

  javascript.javascriptGenerator.forBlock['destroy'] = function(block) {

    return `
    try{  
      let typeId = window.app.world.getBlockAt(_x,_y,_z);
      if(typeId!=0){
        let block = Block.getById(typeId);
        if(block?.getSound()){
          let soundName = block.getSound().getBreakSound();
          // Play sound
          window.app.soundManager.playSound(
              soundName,
              _x+0.5,_y+0.5,_z+0.5,
              2.0,
              1.0
          );
        }
        // Spawn particle
        window.app.particleRenderer.spawnBlockBreakParticle(window.app.world,_x,_y,_z);
        window.app.world.setBlockAt(_x,_y,_z, 0,1+(window.app.isSingleplayer()?0:2)); 
        window.app.player.digging(0,_x,_y,_z, 0);
      }
    }catch(e){}
    `
  };

  javascript.javascriptGenerator.forBlock['place'] = function(block,generator) {
    let value =  generator.valueToCode(block, 'BLOCK', javascript.Order.ATOMIC)-1;
    return `
      {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
      window.app.player.inventorySelectSlot(`+value+`);
      window.app.world.setBlockAt(_x, _y, _z, typeId,1+(window.app.isSingleplayer()?0:2)); 
      window.app.player.placeBlock(_x,_y,_z,0,typeId,0,0,0);
      }
    `
  };
  javascript.javascriptGenerator.forBlock['wait'] = function(block,generator) {
    let value =  generator.valueToCode(block, 'BLOCK', javascript.Order.ATOMIC);
    return `
      await wait(`+value+`)
      `;
  };
  javascript.javascriptGenerator.forBlock['colour'] = function(block,generator) {
    let colourstr =  generator.valueToCode(block, 'COLOUR', javascript.Order.ATOMIC);

    return `
      {
        let typeId=window.app.world.getBlockAt(_x,_y,_z); 
        if(typeId){
          let block = Block.getById(typeId);
          block.setColor(colourstrip(`+colourstr+`),_x,_y,_z);
        } 
      }
    `
  };
  javascript.javascriptGenerator.forBlock['on_hit_with_at'] = function(block,generator) {
    let BLOCK1 =  generator.valueToCode(block, 'BLOCK1', javascript.Order.ATOMIC);
    let BLOCK2 =  generator.valueToCode(block, 'BLOCK2', javascript.Order.ATOMIC);
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    let DO =  generator.statementToCode(block, 'DO', javascript.Order.ATOMIC);
    //return `
    //  {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
    //  window.app.player.inventorySelectSlot(`+value+`);
    //  window.app.world.setBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`, typeId); 
    //  window.app.player.placeBlock(_x+`+x+`, _y+`+y+`, _z+`+z+`,0, typeId,0,0,0)
    //  }
    //`
    return `
    globfn.onHitWithAt.set("`+BLOCK1+`#`+BLOCK2+`#`+x+`#`+y+`#`+z+`",async function (){`+
    DO
    +`});
    `;
 
     
  };
  javascript.javascriptGenerator.forBlock['on_hit_with'] = function(block,generator) {
    let BLOCK1 =  generator.valueToCode(block, 'BLOCK1', javascript.Order.ATOMIC);
    let BLOCK2 =  generator.valueToCode(block, 'BLOCK2', javascript.Order.ATOMIC);
    let DO =  generator.statementToCode(block, 'DO', javascript.Order.ATOMIC);
    //return `
    //  {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
    //  window.app.player.inventorySelectSlot(`+value+`);
    //  window.app.world.setBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`, typeId); 
    //  window.app.player.placeBlock(_x+`+x+`, _y+`+y+`, _z+`+z+`,0, typeId,0,0,0)
    //  }
    //`

    return `
    globfn.onHitWith.set("`+BLOCK1+`#`+BLOCK2+`",async function (){`+
    DO
    +`});
    `;
  };
  javascript.javascriptGenerator.forBlock['colour_at'] = function(block,generator) {
    let colourstr =  generator.valueToCode(block, 'COLOUR', javascript.Order.ATOMIC);

    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
     let relative = block.getFieldValue('RELATIVE');
    if(relative=="TRUE") 
    return `
    {
      let typeId=window.app.world.getBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`); 
      if(typeId){
        let block = Block.getById(typeId);
        block.setColor(colourstrip(`+colourstr+`),_x+`+x+`, _y+`+y+`, _z+`+z+`);
      } 
    }
    `;
    else return `
     {
      let typeId=window.app.world.getBlockAt(`+x+`,`+y+`,`+z+`); 
      if(typeId){
        let block = Block.getById(typeId);
        block.setColor(colourstrip(`+colourstr+`),`+x+`,`+y+`,`+z+`);
      } 
    }
    `;
  };
  javascript.javascriptGenerator.forBlock['goto'] = function(block,generator) {
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    let relative = block.getFieldValue('RELATIVE');
    if(relative=="TRUE") return `
      {
        _x+=`+x+`;
        _y+=`+y+`;
        _z+=`+z+`;
      }
      `;
    else return `
      {
        _x=`+x+`;
        _y=`+y+`;
        _z=`+z+`;
      }`;
  };
  javascript.javascriptGenerator.forBlock['place_at'] = function(block,generator) {
    let value =  generator.valueToCode(block, 'BLOCK', javascript.Order.ATOMIC)-1;
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    let relative = block.getFieldValue('RELATIVE');
    if(relative=="TRUE") return `
      {
        let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
        window.app.player.inventorySelectSlot(`+value+`);
        window.app.world.setBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`, typeId,1+(window.app.isSingleplayer()?0:2)); 
        window.app.player.placeBlock(_x+`+x+`, _y+`+y+`, _z+`+z+`,0, typeId,0,0,0)
      }
    `; 
    else return `
      {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
      window.app.player.inventorySelectSlot(`+value+`);
      window.app.world.setBlockAt(`+x+`,`+y+`,`+z+`, typeId,1+(window.app.isSingleplayer()?0:2)); 
      window.app.player.placeBlock(`+x+`,`+y+`,`+z+`,0, typeId,0,0,0)
      }
    `;
  };
  javascript.javascriptGenerator.forBlock['destroy_at'] = function(block,generator) {
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
     let relative = block.getFieldValue('RELATIVE');
    if(relative=="TRUE") return `
      try{  
        let typeId = window.app.world.getBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`);
        let block = Block.getById(typeId);
        if(block!=0){
          if(block?.getSound()){
            let soundName = block.getSound().getBreakSound();
            // Play sound
            window.app.soundManager.playSound(
                soundName,
                _x+`+x+`+0.5, _y+`+y+`+0.5, _z+`+z+`+0.5,
                2.0,
                1.0
            );
          }
          // Spawn particle
          window.app.particleRenderer.spawnBlockBreakParticle(window.app.world, _x+`+x+`, _y+`+y+`, _z+`+z+`);
          window.app.world.setBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`, 0,1+(window.app.isSingleplayer()?0:2)); 
          window.app.player.digging(0,_x+`+x+`, _y+`+y+`, _z+`+z+`, 0);
        }
      }catch(e){}
    `;
    else return `
    try{  
      let typeId = window.app.world.getBlockAt(`+x+`,`+y+`,`+z+`);
      let block = Block.getById(typeId);
      if(block?.getSound()){
        let soundName = block.getSound().getBreakSound();
        // Play sound
        window.app.soundManager.playSound(
            soundName,
            `+x+`+0.5,`+y+`+0.5,`+z+`+0.5,
            2.0,
            1.0
        );
      }
      // Spawn particle
      window.app.particleRenderer.spawnBlockBreakParticle(window.app.world, `+x+`,`+y+`,`+z+`);
      window.app.world.setBlockAt(`+x+`,`+y+`,`+z+`, 0,1+(window.app.isSingleplayer()?0:2)); 
      window.app.player.digging(0,`+x+`,`+y+`,`+z+`, 0);
    }catch(e){console.log(e)}
    `
  };
  javascript.javascriptGenerator.forBlock['check'] = function(block) {
    let frontback =  block.getFieldValue('FRONTBACK') ;
    let leftright =  block.getFieldValue('LEFTRIGHT') ;
    let topbottom =  block.getFieldValue('TOPBOTTOM') ;
    let dx2='0',dy2='0',dz2='0';

    if(frontback=='back'){
      dx2='(-_dx)';
      dz2='(-_dz)';
    }
    if(frontback=='front'){
      dx2='_dx';
      dz2='_dz';
    }
    if(leftright=='right'){
      dz2+='+((_dz==0)?_dx:0)';
      dx2+='+((_dz==0)?0:(-_dz))';
    }
    if(leftright=='left'){
      dz2+='+((_dz==0)?(-_dx):0)';
      dx2+='+((_dz==0)?0:(_dz))';
    }
    if(topbottom=='top')
      dy2='1';
    if(topbottom=='bottom')
      dy2='(-1)';
    
    return [`window.app.world.getBlockAt(_x+`+dx2+`, _y+`+dy2+`, _z+`+dz2+`)`, javascript.Order.ATOMIC]
  };
  javascript.javascriptGenerator.forBlock['jump_to'] = function(block) {
    let frontback =  block.getFieldValue('FRONTBACK') ;
    let leftright =  block.getFieldValue('LEFTRIGHT') ;
    let topbottom =  block.getFieldValue('TOPBOTTOM') ;
    let dx2='0',dy2='0',dz2='0';

    if(frontback=='back'){
      dx2='(-_dx)';
      dz2='(-_dz)';
    }
    if(frontback=='front'){
      dx2='_dx';
      dz2='_dz';
    }
    if(leftright=='right'){
      dz2+='+((_dz==0)?_dx:0)';
      dx2+='+((_dz==0)?0:(-_dz))';
    }
    if(leftright=='left'){
      dz2+='+((_dz==0)?(-_dx):0)';
      dx2+='+((_dz==0)?0:(_dz))';
    }
    if(topbottom=='top')
      dy2='1';
    if(topbottom=='bottom')
      dy2='(-1)';
    
    return `_x+=`+dx2+`;_y+=`+dy2+`;_z+=`+dz2+`;`;
  };

  javascript.javascriptGenerator.forBlock['check_at'] = function(block,generator) {
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    let relative = block.getFieldValue('RELATIVE');
    if(relative=="TRUE") 
    return [`window.app.world.getBlockAt(_x+`+x+`+0.5, _y+`+y+`+0.5, _z+`+z+`+0.5)`,javascript.Order.ATOMIC]
    else return [`window.app.world.getBlockAt(`+x+`+0.5, `+y+`0.5, `+z+`+0.5)`,javascript.Order.ATOMIC];
  };

  javascript.javascriptGenerator.forBlock['check_color'] = function(block,generator) {
    let frontback =  block.getFieldValue('FRONTBACK') ;
    let leftright =  block.getFieldValue('LEFTRIGHT') ;
    let topbottom =  block.getFieldValue('TOPBOTTOM') ;
    let dx2='0',dy2='0',dz2='0';

    if(frontback=='back'){
      dx2='(-_dx)';
      dz2='(-_dz)';
    }
    if(frontback=='front'){
      dx2='_dx';
      dz2='_dz';
    }
    if(leftright=='right'){
      dz2+='+((_dz==0)?_dx:0)';
      dx2+='+((_dz==0)?0:(-_dz))';
    }
    if(leftright=='left'){
      dz2+='+((_dz==0)?(-_dx):0)';
      dx2+='+((_dz==0)?0:(_dz))';
    }
    if(topbottom=='top')
      dy2='1';
    if(topbottom=='bottom')
      dy2='(-1)';
    

    return [`
    (()=>{
      let typeId=window.app.world.getBlockAt(_x+`+dx2+`, _y+`+dy2+`, _z+`+dz2+`); 
      if(typeId){
        let block = Block.getById(typeId);
        return "#"+block.getColor(window.app.world,_x+`+dx2+`, _y+`+dy2+`, _z+`+dz2+`).toString(16);
      } 
    })()
    `,javascript.Order.ATOMIC]  
  };
  javascript.javascriptGenerator.forBlock['check_color_at'] = function(block,generator) {
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
     let relative = block.getFieldValue('RELATIVE');
    if(relative=="TRUE") 
    return [`
    (()=>{
      let typeId=window.app.world.getBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`); 
      if(typeId){
        let block = Block.getById(typeId);
        return "#"+block.getColor(window.app.world,_x+`+x+`, _y+`+y+`, _z+`+z+`).toString(16);
      } 
    })()
    `,javascript.Order.ATOMIC];
    else
    return [`
    (()=>{
      let typeId=window.app.world.getBlockAt(`+x+`,`+y+`,`+z+`); 
      if(typeId){
        let block = Block.getById(typeId);
        return "#"+block.getColor(window.app.world,`+x+`,`+y+`,`+z+`).toString(16);
      } 
    })()
    `,javascript.Order.ATOMIC]  
  };
