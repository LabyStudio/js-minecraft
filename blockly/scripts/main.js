/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class FocusStateType {

  static REQUEST_EXIT = new FocusStateType(0, 1);
  static EXITED = new FocusStateType(1, -1);

  static REQUEST_LOCK = new FocusStateType(2, 3);
  static LOCKED = new FocusStateType(3, -1);

  constructor(id, intentId) {
      this.id = id;
      this.intentId = intentId;
  }

  getIntent() {
      return this.intentId === -1 ? null : FocusStateType.getById(this.intentId);
  }

  isLock() {
      return this === FocusStateType.REQUEST_LOCK || this === FocusStateType.LOCKED;
  }

  isRequest() {
      return this === FocusStateType.REQUEST_LOCK || this === FocusStateType.REQUEST_EXIT;
  }

  isIntent() {
      return !this.isRequest();
  }

  opposite() {
      switch (this) {
          case FocusStateType.REQUEST_EXIT:
              return FocusStateType.REQUEST_LOCK;
          case FocusStateType.REQUEST_LOCK:
              return FocusStateType.REQUEST_EXIT;
          case FocusStateType.EXITED:
              return FocusStateType.LOCKED;
          case FocusStateType.LOCKED:
              return FocusStateType.EXITED;
          default:
              return null;
      }
  }

  getName() {
      switch (this) {
          case FocusStateType.REQUEST_EXIT:
              return "REQUEST_EXIT";
          case FocusStateType.REQUEST_LOCK:
              return "REQUEST_LOCK";
          case FocusStateType.EXITED:
              return "EXITED";
          case FocusStateType.LOCKED:
              return "LOCKED";
          default:
              return "UNKNOWN";
      }
  }

  static getById(id) {
      switch (id) {
          case 0:
              return FocusStateType.REQUEST_EXIT;
          case 1:
              return FocusStateType.EXITED;
          case 2:
              return FocusStateType.REQUEST_LOCK;
          case 3:
              return FocusStateType.LOCKED;
          default:
              return null;
      }
  }
}

 (function() {
  let currentButton;
  function handlePlay(event) {
    loadWorkspace(blocklySave)
    let code = `
    let hitResult = window.app.player.rayTrace(5, window.app.timer.partialTicks);
    if (hitResult != null) {
      let x = hitResult.x + hitResult.face.x;
      let y = hitResult.y + hitResult.face.y;
      let z = hitResult.z + hitResult.face.z;

      let xp=window.app.player.x;
      let yp=window.app.player.y;
      let zp=window.app.player.z;
      
      let dx=0;
      let dz=0;
      
      if(Math.abs(x-xp)>Math.abs(z-zp))
        if(x-xp>0) dx=1;
        else dx=-1;
      else
        if(z-zp>0) dz=1;
        else dz=-1
    `
    code+=javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
    code+='}'
    
    try {
      eval(code);
    } catch (error) {
      console.log(error);
    }
  }

  function save(button) {
    //button.
    blocklySave = Blockly.serialization.workspaces.save(
    Blockly.getMainWorkspace());
  }

  let blocklySave;

  function loadWorkspace(blocklySave) {
    const workspace = Blockly.getMainWorkspace();
    if (blocklySave) {
      Blockly.serialization.workspaces.load(blocklySave, workspace);
    } else {
      workspace.clear();
    }
  }
    
  function handleSave() {
    document.body.setAttribute('mode', 'edit');
    save(currentButton);
    document.body.setAttribute('mode', 'blockly');
    const div = document.getElementById('blocklycode');
    div.style.visibility = 'hidden';
    window.app.window.updateFocusState(FocusStateType.REQUEST_LOCK);

  }

  function handleRun() {
    document.body.setAttribute('mode', 'edit');
    save(currentButton);
    handlePlay({})
    document.body.setAttribute('mode', 'blockly');
    const div = document.getElementById('blocklycode');
    div.style.visibility = 'hidden'
    window.app.window.updateFocusState(FocusStateType.REQUEST_LOCK);
  }

  function enableBlocklyMode() {
    document.body.setAttribute('mode', 'blockly');
    loadWorkspace(blocklySave);
  }

  document.querySelector('#save').addEventListener('click', handleSave);
  document.querySelector('#run').addEventListener('click', handleRun);

  //
  respondToVisibility = function(element, callback) {
    var options = {
      root: document.documentElement
    }
  
    var observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        callback(entry.intersectionRatio > 0);
      });
    }, options);
  
    observer.observe(element);
  }
  
  respondToVisibility(document.getElementById("blocklycode"), visible => {
    enableBlocklyMode()
  });

  const toolbox ={
    contents: [
      {
        id: 'catMine',
        colour: '0f0',
        name: 'Build',
        kind: 'CATEGORY',
        contents: [
          {
            'kind': 'block',
            'type': 'turn',
          },
          {
            'kind': 'block',
            'type': 'forward',
          },
          {
            'kind': 'block',
            'type': 'up',
          },
          {
            'kind': 'block',
            'type': 'down',
          },
          {
            'kind': 'block',
            'type': 'destroy',
          },
          {
            'kind': 'block',
            'type': 'place',
            'inputs': {
              'BLOCK': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 0,
                  },
                },
              },
            },
          },
          {
            'kind': 'block',
            'type': 'place_at',
            'inputs': {
              'BLOCK': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 1,
                  },
                },
              },
              'X': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 0,
                  },
                },
              },
              'Y': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 0,
                  },
                },
              },
              'Z': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 0,
                  },
                },
              },
            },
          },
        ]
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml: '<block type="controls_if"></block>',
            type: 'controls_if',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_compare"></block>',
            type: 'logic_compare',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_operation"></block>',
            type: 'logic_operation',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_negate"></block>',
            type: 'logic_negate',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_boolean"></block>',
            type: 'logic_boolean',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_null"></block>',
            type: 'logic_null',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="logic_ternary"></block>',
            type: 'logic_ternary',
          },
        ],
        id: 'catLogic',
        colour: '210',
        name: 'Logic',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="controls_repeat_ext">\n          <value name="TIMES">\n            <shadow type="math_number">\n              <field name="NUM">10</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'controls_repeat_ext',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="controls_whileUntil"></block>',
            type: 'controls_whileUntil',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="controls_for">\n          <value name="FROM">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="TO">\n            <shadow type="math_number">\n              <field name="NUM">10</field>\n            </shadow>\n          </value>\n          <value name="BY">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'controls_for',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="controls_forEach"></block>',
            type: 'controls_forEach',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="controls_flow_statements"></block>',
            type: 'controls_flow_statements',
          },
        ],
        id: 'catLoops',
        colour: '120',
        name: 'Loops',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml: '<block type="math_number"></block>',
            type: 'math_number',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="math_arithmetic">\n          <value name="A">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="B">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_arithmetic',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="math_single">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">9</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_single',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="math_trig">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">45</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_trig',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="math_constant"></block>',
            type: 'math_constant',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="math_number_property">\n          <value name="NUMBER_TO_CHECK">\n            <shadow type="math_number">\n              <field name="NUM">0</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_number_property',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="math_change">\n          <value name="DELTA">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_change',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="math_round">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">3.1</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_round',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="math_on_list"></block>',
            type: 'math_on_list',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="math_modulo">\n          <value name="DIVIDEND">\n            <shadow type="math_number">\n              <field name="NUM">64</field>\n            </shadow>\n          </value>\n          <value name="DIVISOR">\n            <shadow type="math_number">\n              <field name="NUM">10</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_modulo',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="math_constrain">\n          <value name="VALUE">\n            <shadow type="math_number">\n              <field name="NUM">50</field>\n            </shadow>\n          </value>\n          <value name="LOW">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="HIGH">\n            <shadow type="math_number">\n              <field name="NUM">100</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_constrain',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="math_random_int">\n          <value name="FROM">\n            <shadow type="math_number">\n              <field name="NUM">1</field>\n            </shadow>\n          </value>\n          <value name="TO">\n            <shadow type="math_number">\n              <field name="NUM">100</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'math_random_int',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="math_random_float"></block>',
            type: 'math_random_float',
          },
        ],
        id: 'catMath',
        colour: '230',
        name: 'Math',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml: '<block type="text"></block>',
            type: 'text',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="text_join"></block>',
            type: 'text_join',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_append">\n          <value name="TEXT">\n            <shadow type="text"></shadow>\n          </value>\n        </block>',
            type: 'text_append',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_length">\n          <value name="VALUE">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_length',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_isEmpty">\n          <value name="VALUE">\n            <shadow type="text">\n              <field name="TEXT"></field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_isEmpty',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_indexOf">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">text</field>\n            </block>\n          </value>\n          <value name="FIND">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_indexOf',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_charAt">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">text</field>\n            </block>\n          </value>\n        </block>',
            type: 'text_charAt',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_getSubstring">\n          <value name="STRING">\n            <block type="variables_get">\n              <field name="VAR">text</field>\n            </block>\n          </value>\n        </block>',
            type: 'text_getSubstring',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_changeCase">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_changeCase',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_trim">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_trim',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_print">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_print',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="text_prompt_ext">\n          <value name="TEXT">\n            <shadow type="text">\n              <field name="TEXT">abc</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'text_prompt_ext',
          },
        ],
        id: 'catText',
        colour: '160',
        name: 'Text',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="lists_create_with">\n          <mutation items="0"></mutation>\n        </block>',
            type: 'lists_create_with',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="lists_create_with"></block>',
            type: 'lists_create_with',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="lists_repeat">\n          <value name="NUM">\n            <shadow type="math_number">\n              <field name="NUM">5</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'lists_repeat',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="lists_length"></block>',
            type: 'lists_length',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="lists_isEmpty"></block>',
            type: 'lists_isEmpty',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="lists_indexOf">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
            type: 'lists_indexOf',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="lists_getIndex">\n          <value name="VALUE">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
            type: 'lists_getIndex',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="lists_setIndex">\n          <value name="LIST">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
            type: 'lists_setIndex',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="lists_getSublist">\n          <value name="LIST">\n            <block type="variables_get">\n              <field name="VAR">list</field>\n            </block>\n          </value>\n        </block>',
            type: 'lists_getSublist',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="lists_split">\n          <value name="DELIM">\n            <shadow type="text">\n              <field name="TEXT">,</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'lists_split',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="lists_sort"></block>',
            type: 'lists_sort',
          },
        ],
        id: 'catLists',
        colour: '260',
        name: 'Lists',
      },
      {
        kind: 'CATEGORY',
        contents: [
          {
            kind: 'BLOCK',
            blockxml: '<block type="colour_picker"></block>',
            type: 'colour_picker',
          },
          {
            kind: 'BLOCK',
            blockxml: '<block type="colour_random"></block>',
            type: 'colour_random',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="colour_rgb">\n          <value name="RED">\n            <shadow type="math_number">\n              <field name="NUM">100</field>\n            </shadow>\n          </value>\n          <value name="GREEN">\n            <shadow type="math_number">\n              <field name="NUM">50</field>\n            </shadow>\n          </value>\n          <value name="BLUE">\n            <shadow type="math_number">\n              <field name="NUM">0</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'colour_rgb',
          },
          {
            kind: 'BLOCK',
            blockxml:
              '<block type="colour_blend">\n          <value name="COLOUR1">\n            <shadow type="colour_picker">\n              <field name="COLOUR">#ff0000</field>\n            </shadow>\n          </value>\n          <value name="COLOUR2">\n            <shadow type="colour_picker">\n              <field name="COLOUR">#3333ff</field>\n            </shadow>\n          </value>\n          <value name="RATIO">\n            <shadow type="math_number">\n              <field name="NUM">0.5</field>\n            </shadow>\n          </value>\n        </block>',
            type: 'colour_blend',
          },
        ],
        id: 'catColour',
        colour: '20',
        name: 'Colour',
      },
      {
        kind: 'SEP',
      },
      {
        kind: 'CATEGORY',
        id: 'catVariables',
        colour: '330',
        custom: 'VARIABLE',
        name: 'Variables',
      },
      {
        kind: 'CATEGORY',
        id: 'catFunctions',
        colour: '290',
        custom: 'PROCEDURE',
        name: 'Functions',
      },
    ],
    id: 'toolbox',
    style: 'display: none',
  };

  Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    scrollbars: true,
    horizontalLayout: false,
    toolboxPosition: "left",
  });
})();
