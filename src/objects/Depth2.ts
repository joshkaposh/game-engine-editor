import Vect2 from "../vector/Vect2"
import GameObject, { EditorObject } from "./object/GameObject";

type Depth2Config = {
    pos: Vect2;
    size: Vect2;
}

class Depth2 extends GameObject {
    pos: Vect2;
    size: Vect2;
    constructor(pos: Vect2, size: Vect2) {
        super();
        this.pos = pos;
        this.size = size;
    }
}


export default {
    obj: Depth2,
    editor: new EditorObject({
        create:(config: Depth2Config) => new Depth2(config.pos, config.size),
        config:(): Depth2Config => ({pos:new Vect2(0,0),size:new Vect2(25,25)})
    })
}