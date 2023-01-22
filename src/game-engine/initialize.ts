import type { Store } from "solid-js/store";
import type { ClassTypes } from "../objects";
import { toArrays } from "../objects"
import Render2d from "../render/Render2d";
import Time from "./time/Time";
const bind = (fn:(...args:any) => void,to:object) => fn.bind(to)

class GameEngine {
    renderer: Render2d
    #canvas!: HTMLCanvasElement;
    time!: Time;
    animationId!: number;
    objects:ReturnType<typeof toArrays>['dict'];
    lengthStore: Store<{[key:string]:number}>
    setLength: (key: string, length: number) => void;
    constructor() {
        this.renderer = new Render2d();
        const mainDict = toArrays()
        this.objects = mainDict.dict
        this.lengthStore = mainDict.lengths[0]
        this.setLength = (key: string, length: number) => {
            mainDict.lengths[1](key,length)
        }

        console.log(this.objects);
        
    }

    init(canvas: HTMLCanvasElement) {
        console.log('Engine Initializing');
        this.#canvas = canvas;
        this.renderer.init(canvas)
        this.time = Time.getInstance()
    }

    add(gameObject:ClassTypes) {
        if (gameObject.goName in this.objects) {
            const arr = this.objects[gameObject.goName] 
            arr.push(gameObject)
            this.setLength(gameObject.goName,arr.length)

        }
        console.log(this.objects);
    }

    loop() {
        this.time.step();
        this.renderer.render(this.objects['RectMesh'] as any)

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