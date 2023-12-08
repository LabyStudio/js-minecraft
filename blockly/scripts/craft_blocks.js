import Block from "../../src/js/net/minecraft/client/world/block/Block.js"

window.Block=Block;
  Blockly.defineBlocksWithJsonArray([
    // Block for colour picker.
    {
      "type": "wait",
      "message0": "warte %1 %2",
      "args0": [
        {
          "type": "input_value",
          "name": "BLOCK",
          "check": "Number",
        },
        {
          "type": "input_end_row"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": '9c0',
      "tooltip": "",
      "helpUrl": ""
    },
    {
      "type": "turn",
      "message0": "Drehe %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "VALUE",
          "options": [
            ["rechts", "right"],
            ["links", "left"],
            ["umdrehen", "turnaround"],
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": '9c0',
    },
    {
      "type": "forward",
      "message0": "Vor",
      "previousStatement": null,
      "nextStatement": null,
      "colour": '9c0',
    },
    {
      "type": "back",
      "message0": "Zurück",
      "previousStatement": null,
      "nextStatement": null,
      "colour": '9c0',
    },
    {
    "type": "up",
    "message0": "Hoch",
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
  },
  {
    "type": "down",
    "message0": "Runter",
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
  },
  {
    "type": "jump_to",
    "message0": "Springe nach %1 %2 %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FRONTBACK",
        "options": [
          ["", ""],
          ["vorne", "front"],
          ["hinten", "back"],
        ]
      },
      {
        "type": "field_dropdown",
        "name": "LEFTRIGHT",
        "options": [
          ["", ""],
          ["links", "left"],
          ["rechts", "right"],
        ]
      },
      {
        "type": "field_dropdown",
        "name": "TOPBOTTOM",
        "options": [
          ["", ""],
          ["oben", "top"],
          ["unten", "bottom"],
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
  },
  {
    "type": "destroy",
    "message0": "Zerstoere",
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
  },
    {
    "type": "place",
    "message0": "Platziere %1 %2",
    "args0": [
      {
        "type": "input_value",
        "name": "BLOCK",
        "check": "Number",
      },
      {
        "type": "input_end_row"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
    "tooltip": "",
    "helpUrl": ""
  },//todo check color
  {
    "type": "colour",
    "message0": "Färbe %1 %2",
    "args0": [
      {
        "type": "input_value",
        "name": "COLOUR",
      },
      {
        "type": "input_end_row"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "on_hit_with",
    "message0": "Wenn Block %1 mit Block %2 geschlagen",
    "args0": [
      {"type": "input_value", "name": "BLOCK1", "check": "Number"},
      {"type": "input_value", "name": "BLOCK2", "check": "Number"}
    ],
    "message1": "mache %1",
    "args1": [
      {"type": "input_statement", "name": "DO"}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "on_hit_with_at",
    "message0": "Wenn Block %1 mit Block %2 geschlagen bei x: %3 y: %4 z: %5",
    "args0": [
      {"type": "input_value", "name": "BLOCK1", "check": "Number"},
      {"type": "input_value", "name": "BLOCK2", "check": "Number"},
      { "type": "input_value","name": "X", "check": "Number" },
      { "type": "input_value","name": "Y", "check": "Number" },
      { "type": "input_value","name": "Z", "check": "Number" }
    ],
    "message1": "mache %1",
    "args1": [
      {"type": "input_statement", "name": "DO"}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0'
  },
  {
    "type": "colour_at",
    "message0": "Färbe %1 bei x: %2 y: %3 z: %4 %5",
    "args0": [
      {
        "type": "input_value",
        "name": "COLOUR",
       // "check": "Number",
      },
      {
        "type": "input_value",
        "name": "X",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Y",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Z",
        "check": "Number",
      },

      {
        "type": "input_end_row"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "goto",
    "message0": "Gehe zu x: %1 y: %2 z: %3 %4",
    "args0": [
      {
        "type": "input_value",
        "name": "X",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Y",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Z",
        "check": "Number",
      },

      {
        "type": "input_end_row"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "place_at",
    "message0": "Platziere %1 bei x: %2 y: %3 z: %4 %5",
    "args0": [
      {
        "type": "input_value",
        "name": "BLOCK",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "X",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Y",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Z",
        "check": "Number",
      },

      {
        "type": "input_end_row"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "destroy_at",
    "message0": "Zerstöre bei x: %1 y: %2 z: %3 %4",
    "args0": [
      {
        "type": "input_value",
        "name": "X",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Y",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Z",
        "check": "Number",
      },

      {
        "type": "input_end_row"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": '9c0',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "check",
    "message0": "Fühle %1 %2 %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FRONTBACK",
        "options": [
          ["", ""],
          ["vorne", "front"],
          ["hinten", "back"],
        ]
      },
      {
        "type": "field_dropdown",
        "name": "LEFTRIGHT",
        "options": [
          ["", ""],
          ["links", "left"],
          ["rechts", "right"],
        ]
      },
      {
        "type": "field_dropdown",
        "name": "TOPBOTTOM",
        "options": [
          ["", ""],
          ["oben", "top"],
          ["unten", "bottom"],
        ]
      }
    ],
    "output": "Number",
    "colour": '9c0',
  },
  {
    "type": "check_at",
    "message0": "Fühle bei x: %1 y: %2 z: %3 %4",
    "args0": [
      {
        "type": "input_value",
        "name": "X",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Y",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Z",
        "check": "Number",
      },
      {
        "type": "input_end_row"
      }
    ],
    "output": "Number",
    "inputsInline": true,
    "colour": '9c0',
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "check_color",
    "message0": "Farbe %1 %2 %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FRONTBACK",
        "options": [
          ["", ""],
          ["vorne", "front"],
          ["hinten", "back"],
        ]
      },
      {
        "type": "field_dropdown",
        "name": "LEFTRIGHT",
        "options": [
          ["", ""],
          ["links", "left"],
          ["rechts", "right"],
        ]
      },
      {
        "type": "field_dropdown",
        "name": "TOPBOTTOM",
        "options": [
          ["", ""],
          ["oben", "top"],
          ["unten", "bottom"],
        ]
      }
    ],
    "output": "Number",
    "colour": '9c0',
  },
  {
    "type": "check_color_at",
    "message0": "Farbe bei x: %1 y: %2 z: %3 %4",
    "args0": [
      {
        "type": "input_value",
        "name": "X",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Y",
        "check": "Number",
      },
      {
        "type": "input_value",
        "name": "Z",
        "check": "Number",
      },
      {
        "type": "input_end_row"
      }
    ],
    "output": "Number",
    "inputsInline": true,
    "colour": '9c0',
    "tooltip": "",
    "helpUrl": ""
  }
  ]);

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
    window.app.world.setBlockAt(_x, _y, _z,0);
    window.app.player.digging(0,_x,_y,_z,0);
    `
  };

  javascript.javascriptGenerator.forBlock['place'] = function(block,generator) {
    let value =  generator.valueToCode(block, 'BLOCK', javascript.Order.ATOMIC);
    return `
      {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
      window.app.player.inventorySelectSlot(`+value+`);
      window.app.world.setBlockAt(_x, _y, _z, typeId); 
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
  javascript.javascriptGenerator.forBlock['on_hit_with'] = function(block,generator) {
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
    function onHitWith(){`+
    DO
    +`}
    `;
     
  };
  javascript.javascriptGenerator.forBlock['on_hit_with_at'] = function(block,generator) {
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
    function onHitWith(){`+
    DO
    +`}
    `;
  };
  javascript.javascriptGenerator.forBlock['colour_at'] = function(block,generator) {
    let colourstr =  generator.valueToCode(block, 'COLOUR', javascript.Order.ATOMIC);

    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    //return `
    //  {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
    //  window.app.player.inventorySelectSlot(`+value+`);
    //  window.app.world.setBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`, typeId); 
    //  window.app.player.placeBlock(_x+`+x+`, _y+`+y+`, _z+`+z+`,0, typeId,0,0,0)
    //  }
    //`
     return `
     {
      let typeId=window.app.world.getBlockAt(`+x+`,`+y+`,`+z+`); 
      if(typeId){
        let block = Block.getById(typeId);
        block.setColor(colourstrip(`+colourstr+`),`+x+`,`+y+`,`+z+`);
      } 
    }
    `
  };
  javascript.javascriptGenerator.forBlock['goto'] = function(block,generator) {
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    //return `
    //  {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
    //  window.app.player.inventorySelectSlot(`+value+`);
    //  window.app.world.setBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`, typeId); 
    //  window.app.player.placeBlock(_x+`+x+`, _y+`+y+`, _z+`+z+`,0, typeId,0,0,0)
    //  }
    //`
     return `
      {
        _x=`+x+`;
        _y=`+y+`;
        _z=`+z+`;
      }`
  };
  javascript.javascriptGenerator.forBlock['place_at'] = function(block,generator) {
    let value =  generator.valueToCode(block, 'BLOCK', javascript.Order.ATOMIC);
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    //return `
    //  {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
    //  window.app.player.inventorySelectSlot(`+value+`);
    //  window.app.world.setBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`, typeId); 
    //  window.app.player.placeBlock(_x+`+x+`, _y+`+y+`, _z+`+z+`,0, typeId,0,0,0)
    //  }
    //`
     return `
      {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
      window.app.player.inventorySelectSlot(`+value+`);
      window.app.world.setBlockAt(`+x+`,`+y+`,`+z+`, typeId); 
      window.app.player.placeBlock(`+x+`,`+y+`,`+z+`,0, typeId,0,0,0)
      }
    `
  };
  javascript.javascriptGenerator.forBlock['destroy_at'] = function(block,generator) {
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    //return `
    //  {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
    //  window.app.player.inventorySelectSlot(`+value+`);
    //  window.app.world.setBlockAt(_x+`+x+`, _y+`+y+`, _z+`+z+`, typeId); 
    //  window.app.player.placeBlock(_x+`+x+`, _y+`+y+`, _z+`+z+`,0, typeId,0,0,0)
    //  }
    //`
     return `
      {
        window.app.world.setBlockAt(`+x+`,`+y+`,`+z+`, 0); 
        window.app.world.digging(0,`+x+`,`+y+`,`+z+`, 0); 
      }
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
    return [`window.app.world.getBlockAt(`+x+`+0.5, `+y+`0.5, `+z+`+0.5)`,javascript.Order.ATOMIC]
  };

  javascript.javascriptGenerator.forBlock['check_color'] = function(block,generator) {

    return [``,javascript.Order.ATOMIC]  
  };
  javascript.javascriptGenerator.forBlock['check_color_at'] = function(block,generator) {
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    return [``,javascript.Order.ATOMIC]
  };
