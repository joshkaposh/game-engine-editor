import GameObject,{EditorObject} from "./object/GameObject";
import Vect2 from "../vector/Vect2";

export type TransformConfig = {
    pos: Vect2;
}

export const editor = new EditorObject({
    create: (config) => new Transform(config.pos),
    config:() => ({pos:new Vect2(0,0)}) satisfies TransformConfig
})

export class Transform extends GameObject implements TransformConfig {
    pos: Vect2;
    constructor(pos:Vect2) {
        super(Transform.name);
        this.pos = pos;
    }
}

export default {
    obj: Transform,
    editor
}