import type { Store } from "solid-js/store";
import type { ClassTypes } from "../objects";
import { toArrays } from "../objects"
import Render2d from "../render/Render2d";
import Time from "./time/Time";

export type LengthStore = Store<{[key:string]:number}>
export type ObjectDict = ReturnType<typeof toArrays>['dict'];
const bind = (fn:(...args:any) => void,to:object) => fn.bind(to)

class Objects {
    objects: ObjectDict
    lengthStore: LengthStore
    setLength: (key: string, length: number) => void;
    constructor() {
        const mainDict = toArrays()
        this.objects = mainDict.dict
        this.lengthStore = mainDict.lengths[0]
        this.setLength = (key: string, length: number) => {
            mainDict.lengths[1](key,length)
        }
    }
    
    add(gameObject:ClassTypes) {
        if (gameObject.goName in this.objects) {
            const arr = this.objects[gameObject.goName] 
            arr.push(gameObject)
            this.setLength(gameObject.goName,arr.length)

        }
        console.log(this.objects);
        console.log(this.lengthStore);
    }
}

class GameEngine {
    renderer: Render2d
    #canvas!: HTMLCanvasElement;
    time!: Time;
    animationId!: number;
    dict: Objects
    constructor() {
        this.renderer = new Render2d();
        this.dict = new Objects();
    }

    init(canvas: HTMLCanvasElement) {
        console.log('Engine Initializing');
        this.#canvas = canvas;
        this.renderer.init(canvas)
        this.time = Time.getInstance()
    }


    loop() {
        this.time.step();
        this.renderer.render(this.dict.objects['RectMesh'] as any)

        this.animationId = requestAnimationFrame(bind(this.loop, this))
    }

    start() {
        this.animationId = requestAnimationFrame(bind(this.loop,this))
    }

    stop() {
        cancelAnimationFrame(this.animationId)
    }
}

    

export default GameEngine