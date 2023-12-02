/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//aus miniconda
//execute in blockly_git: npm i
//npm run build
//modified files in \blockly_git\generators\javascript\procedures.js to allow for async functions
//
//we need globfn[] for coordinates and position
//as code can run parallel due to async wait...
//variables starting with g are global others are local
//we need a on run button pressed function
//todo add break in loops and function entry to allow for breaking
//infitine loops
//we might also need to break promises.
//https://ckeditor.com/blog/Aborting-a-signal-how-to-cancel-an-asynchronous-task-in-JavaScript/
//we should have a special function block that is executed is a promise.all way
//then we need waitfor async command that waits e.g. for block at a certain position to be hit
//the chat needs to be made in a way to support html
//then merge the mintrobi game engine in
//Promise.all waits for all promises to be fullfilled or rejects when one rejects
//we should replace all await function calls with Promise.all(fn,breaker)
//where breaker is a promise that is used to break
//then we need to mark functions as parallelizable functions
//and they are called only in the code execution with promise.all or better Promise.race()
//we should also use in loops a  promise.all(sync,breaker)
//where sync waits every 20th time for 1ms
/*
//also https://blog.logrocket.com/complete-guide-abortcontroller-node-js/
https://ckeditor.com/blog/Aborting-a-signal-how-to-cancel-an-asynchronous-task-in-JavaScript/
class Breaker extends Promise {
    constructor(f) {
    let rej;
    super((resolve,reject)=>{rej=reject;f(resolve,reject);});
    this.rej=rej;
  }
}

function wait(time) {
  return new Promise((res)=>setTimeout(res, time));
}
function wait2(time) {
  return new Breaker((res)=>{});
}
(async () => {

console.log(1)
let w2=wait2(3000);
setTimeout(w2.rej, 500)
//w2.rej()
try{
  await Promise.race([wait(0),w2])
}catch{
  console.log("err")
}
console.log(2)

function wait(time,{signal}){
  if (signal?.aborted){
    return Promise.reject(new DOMException("Aborted", "AbortError"));
  }
  return new Promise((resolve, reject) => {
    console.log("Promise Started");
    let timeout;
    const abortHandler = () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    }
    // start async operation
    timeout = setTimeout(() => {
      resolve("Promise Resolved");
      //signal?.removeEventListener("abort", abortHandler);
    }, time);    
    signal?.addEventListener("abort", abortHandler,{ once: true });
  });
}

setTimeout(()=>{controller.abort()},200)

const abortctrl = new AbortController();
    controller.abort()
// invoke controller.abort() in some callback
try{
  console.log('ee')
  const result = await wait(0,{signal: abortctrl.signal});
  console.log(result);
}
catch (e){
  console.warn(e.name === "AbortError" ? "Promise Aborted" : "Promise Rejected");
}
  
})()
*/
var abortctrl = new AbortController();
function abortscript()
{
    abortctrl.abort();
    is_script_ended=0;
}
var is_script_ended=0;
function abortablewait(time,{signal}){
  if (signal?.aborted){
    return Promise.reject(new DOMException("Aborted", "AbortError"));
  }
  return new Promise((resolve, reject) => {
    //console.log("Promise Started");
    let timeout;
    const abortHandler = () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    }
    // start async operation
    timeout = setTimeout(() => {
      //console.log("Promise Resolved");
      resolve("Promise Resolved");
      //signal?.removeEventListener("abort", abortHandler);
    }, time);    
    signal?.addEventListener("abort", abortHandler,{ once: true });
  });
}

function wait(time) {
  return abortablewait(time,{signal: abortctrl.signal});
}

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
let blocklyFunctions=null;
var blocklycode="";
 (function() {
  function globalEval(src) {
    var fn = function() {
        window.eval.call(window,src);
    };
    fn();
  };
  let currentButton;
  function handlePlay(event) {
    loadWorkspace(blocklySave)
    let blocklycodepre = `
    var globfn={};//only use this in main.js in order to use multiple parallel asynch executed functions we might need an array, we can reuse the array if is_script_ended is true
    //also we should have globfn array to handle entities such as block that behaves like an animal
    //or at least we should store the current globfn in a variable that belongs to entity
    `;
  
    let generatedcode=javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
    
    const varregexp = /[ ]*var[ ]+[a-zA-Z0-9, $_]*;/;
    const vars=generatedcode.match(varregexp);//TODO we should select out variables starting with g to be global
    let gvars="";
    let lvars="";
    if(vars){
      console.log('!!!!'+vars[0])
      gvars=vars[0].substring(4).
      split(/\s*(?:,|;$)\s*/).
      filter(s=>s.startsWith('g')).
      join(',');
      lvars=vars[0].substring(4).
      split(/\s*(?:,|;$)\s*/).
      filter(s=>!s.startsWith('g')).
      slice(0,-1).
      join(',');
      console.log('globs'+gvars)
      console.log('lobs'+lvars)
    }
    blocklycodepre+=gvars?"var "+gvars+";":"";
    blocklycode=`\n(async () => {`;
    blocklycode+=`
    is_script_ended++;
    try{
    var _x;
    var _y;
    var _z;

    var _xp;
    var _yp;
    var _zp;
    
    var _dx;
    var _dz;
    var hitResult = window.app.player.rayTrace(5, window.app.timer.partialTicks);
    if (hitResult != null) {
      _x = hitResult.x + hitResult.face.x;
      _y = hitResult.y + hitResult.face.y;
      _z = hitResult.z + hitResult.face.z;

      _xp=window.app.player.x;
      _yp=window.app.player.y;
      _zp=window.app.player.z;      
      _dx=0;
      _dz=0;
      
      if(Math.abs(_x-_xp)>Math.abs(_z-_zp))
        if(_x-_xp>0) _dx=1;
        else _dx=-1;
      else
        if(_z-_zp>0) _dz=1;
        else _dz=-1
    }
    `
    blocklycode+=lvars?"var "+lvars+";":"";
    blocklycode+=generatedcode.replace(varregexp,"");
    //https://www.debuggex.com/#cheatsheet
    //globfn.a= async function () {
    // /globfn.([a-zA-Z_$0-9]+)[ ]*=[ ]*async[ ]+function[ ]*\(/g;
    const regexp = /globfn\.([a-zA-Z_$0-9]+)=/g;
    const str = generatedcode;
    blocklyFunctions = [...str.matchAll(regexp)].map((x) => x[1]);
    //console.log(blocklyFunctions);
   
    blocklycode += 'is_script_ended--; }catch{}})();';
    
    try {
      console.log(blocklycodepre+blocklycode);
      globalEval(blocklycodepre+blocklycode);
    } catch (error) {
      console.log(error);
    }
  }

  function save(button) {
    blocklySave = Blockly.serialization.workspaces.save(
    Blockly.getMainWorkspace());
    localStorage.setItem("blocklySave", JSON.stringify(blocklySave));
  }

  let blocklySave=null;

  function loadWorkspace(blocklySave) {
    toolbox.contents[0].contents[0].inputs.BLOCK.shadow.fields.NUM++;
    //TODO here we should set current coordinate in all place_at and check_at
    //console.log("!!!!"+toolbox.contents[0].contents.find((element) => element.type==="wait").inputs.BLOCK.shadow.fields.NUM++);
    const workspace = Blockly.getMainWorkspace();
    workspace.toolbox_.flyout_.hide();
    if(!blocklySave){
       blocklySave=JSON.parse(localStorage.getItem("blocklySave"));
       workspace.clear();
    }
    if (blocklySave) {
      Blockly.serialization.workspaces.load(blocklySave, workspace);
    }
  }
    
  function handleBack() {
    delete abortctrl;
    abortctrl=new AbortController();
    document.body.setAttribute('mode', 'edit');
    save(currentButton);
    loadWorkspace(blocklySave)
    document.body.setAttribute('mode', 'blockly');
    const div = document.getElementById('blocklycode');
    div.style.visibility = 'hidden';
    window.app.window.updateFocusState(FocusStateType.REQUEST_LOCK);

  }

  function handleRun() {
    delete abortctrl;
    abortctrl=new AbortController();
    document.body.setAttribute('mode', 'edit');
    save(currentButton);
    handlePlay({})
    document.body.setAttribute('mode', 'blockly');
    const div = document.getElementById('blocklycode');
    div.style.visibility = 'hidden'
    window.app.window.updateFocusState(FocusStateType.REQUEST_LOCK);
  }
  function download(data, fileName, contentType) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {
      type:contentType
    }));
    a.setAttribute("download",fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  function handleSave(){
    save(currentButton);
    download( blocklySave, 'mintblock.json', 'text/plain');
  }    
//https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
  function handleLoad(){
    const i=document.createElement("input");
    i.type="file";
    i.addEventListener("change", loadFile, false);
    document.body.appendChild(i);
    i.click();
      function loadFile(){
        console.log(i.files); 
        let reader = new FileReader();

        reader.readAsText(i.files[0]);
      
        reader.onload = function() {
          blocklySave=null;         
          localStorage.setItem("blocklySave", reader.result);
          loadWorkspace(blocklySave)
          console.log(reader.result);
        };
      
        reader.onerror = function() {
          console.log(reader.error);
        };
        document.body.removeChild(i);
      }
  }
  
  function enableBlocklyMode() {
    document.body.setAttribute('mode', 'blockly');
    loadWorkspace(blocklySave);
  }

  document.querySelector('#back').addEventListener('click', handleBack);
  document.querySelector('#run').addEventListener('click', handleRun);
  document.querySelector('#save').addEventListener('click', handleSave);
  document.querySelector('#load').addEventListener('click', handleLoad);
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
    //Problem this is only called at the beginning and never again
    enableBlocklyMode()
  });

  const toolbox ={
    contents: [
      {
        id: 'catMine',
        colour: '0f0',
        name: 'Baue',
        kind: 'CATEGORY',
        contents: [
          {
            'kind': 'block',
            'type': 'wait',
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
            'type': 'turn',
          },
          {
            'kind': 'block',
            'type': 'forward',
          },
          {
            'kind': 'block',
            'type': 'back',
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
            'type': 'jump_to',
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
          {
            'kind': 'block',
            'type': 'check',
          },
          {
            'kind': 'block',
            'type': 'check_at',
            'inputs': {
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
        name: 'Logik',
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
        name: 'Schleifen',
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
        name: 'Mathe',
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
        name: 'Listen',
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
        name: 'Farbe',
      },
      {
        kind: 'SEP',
      },
      {
        kind: 'CATEGORY',
        id: 'catVariables',
        colour: '330',
        custom: 'VARIABLE',
        name: 'Variablen',
      },
      {
        kind: 'CATEGORY',
        id: 'catFunctions',
        colour: '290',
        custom: 'PROCEDURE',
        name: 'Funktionen',
      },
    ],
    id: 'toolbox',
    style: 'display: none',
  };
  //todo get rid of loading sprites from
  //https://blockly-demo.appspot.com/static/media/sprites.png
  Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    scrollbars: true,
    horizontalLayout: false,
    toolboxPosition: "left",
    renderer:"zelos",
    zoom:
    {controls: true,
     wheel: true,
     startScale: 0.8,
     maxScale: 3,
     minScale: 0.3,
     scaleSpeed: 1.2,
     pinch: true},
  });
})();
