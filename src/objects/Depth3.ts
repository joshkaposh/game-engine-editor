import GameObject, { EditorObject } from "./object/GameObject";

type Depth3Config = {
    inner1: Inner
}

type Inner = {
    inner2: {
        inner3: string
    }
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
    editor: new EditorObject({
        create: (config) => new Depth3(config.inner1),
        config: {inner1:{inner2: {inner3:''}}} satisfies Depth3Config
    })
}