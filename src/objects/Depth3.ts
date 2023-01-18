import GameObject,{EditorObject} from "./object/GameObject";

type Inner = {
    inner2: {
        inner3: string
    }
}

type Depth3Config = {
    inner1: Inner
}

export const EditorDepth3:EditorObject<Depth3,Depth3Config> = {
    create: (config:Depth3Config) => new Depth3(config.inner1),
    config: (): Depth3Config => ({inner1:{inner2:{inner3:''}}})
}

class Depth3 extends GameObject implements Depth3Config {
    inner1: Inner;
    constructor(inner1: Inner) {
        super();
        this.inner1 = inner1;
        
    }
}

export default {
    obj: Depth3,
    editor: EditorDepth3
}