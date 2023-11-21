
  Blockly.defineBlocksWithJsonArray([
    // Block for colour picker.
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
            ["zurueck", "back"],
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 355,
    },
    {
      "type": "forward",
      "message0": "Vor",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 355,
    },
    {
    "type": "up",
    "message0": "Hoch",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 355,
  },
  {
    "type": "down",
    "message0": "Runter",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 355,
  },
    {
    "type": "destroy",
    "message0": "Zerstoere",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 355,
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
    "colour": 230,
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
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "check",
    "output": "Number",
    "message0": "Fühle",
    "colour": 355,
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
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
  ]);

  javascript.javascriptGenerator.forBlock['turn'] = function(block) {
    let value =  block.getFieldValue('VALUE') ;
   // return 'MusicMaker.queueSound(' + value + ');\n';
    if(value=='back') return `
      dx=-dx;
      dz=-dz;
    `;
    if(value=='right') return `
      if(dz==0) {
        dz=dx;
        dx=0;
      }
      else{
        dx=-dz;
        dz=0;
      }
    `
    if(value=='left') return `
      if(dz==0) {
        dz=-dx;
        dx=0;
      }
      else{
        dx=dz;
        dz=0;
      }
  `;
  };

  javascript.javascriptGenerator.forBlock['forward'] = function(block) {
    return `
      x+=dx;
      z+=dz;
    `
  }
  
  javascript.javascriptGenerator.forBlock['up'] = function(block) {
    return `
      y+=1;
    `
  }
  javascript.javascriptGenerator.forBlock['down'] = function(block) {
    return `
    y-=1;
    `
  };

  javascript.javascriptGenerator.forBlock['destroy'] = function(block) {

    return `
    window.app.world.setBlockAt(x, y, z,0);
    window.app.player.digging(0,x,y,z,0);
    `
  };

  javascript.javascriptGenerator.forBlock['place'] = function(block,generator) {
    let value =  generator.valueToCode(block, 'BLOCK', javascript.Order.ATOMIC);
    return `
      {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
      window.app.player.inventorySelectSlot(`+value+`);
      window.app.world.setBlockAt(x, y, z, typeId); 
      window.app.player.placeBlock(x,y,z,0,typeId,0,0,0);
      }
    `
  };

  javascript.javascriptGenerator.forBlock['place_at'] = function(block,generator) {
    let value =  generator.valueToCode(block, 'BLOCK', javascript.Order.ATOMIC);
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    return `
      {let typeId = window.app.player.inventory.getItemInSlot(`+value+`);
      window.app.player.inventorySelectSlot(`+value+`);
      window.app.world.setBlockAt(x+`+x+`, y+`+y+`, z+`+z+`, typeId); 
      window.app.player.placeBlock(x+`+x+`, y+`+y+`, z+`+z+`,0, typeId,0,0,0)
      }
    `
  };

  javascript.javascriptGenerator.forBlock['check'] = function(block) {
    return [`window.app.world.getBlockAt(x+0.5, y+0.5, z+0.5)`, javascript.Order.ATOMIC]
  };

  javascript.javascriptGenerator.forBlock['check_at'] = function(block,generator) {
    let x =  generator.valueToCode(block, 'X', javascript.Order.ATOMIC);
    let y =  generator.valueToCode(block, 'Y', javascript.Order.ATOMIC);
    let z =  generator.valueToCode(block, 'Z', javascript.Order.ATOMIC);
    return [`window.app.world.getBlockAt(`+x+`+0.5, `+y+`0.5, `+z+`+0.5)`,javascript.Order.ATOMIC]
  };

