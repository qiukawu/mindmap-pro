export class History {
  constructor(){ this.stack = []; this.ptr = -1 }
  push(action){ this.stack.splice(this.ptr+1); this.stack.push(action); this.ptr = this.stack.length-1 }
  undo(){ if(this.ptr>=0) this.ptr--; }
  redo(){ if(this.ptr < this.stack.length-1) this.ptr++; }
}
