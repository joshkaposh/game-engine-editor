import objects, { ClassTypes } from "../objects"
import Render2d from "../render/Render2d";
import Time from "./time/Time";

const bind = (fn:(...args:any) => void,to:object) => fn.bind(to)

class GameEngine {
    renderer: Render2d
    #canvas!: HTMLCanvasElement;
    time!: Time;
    animationId!: number;
    constructor() {
        this.renderer = new Render2d();
        
    }

    init(canvas: HTMLCanvasElement) {
        console.log('Engine Initializing');
        this.#canvas = canvas;
        this.renderer.init(canvas)
        this.time = Time.getInstance()
    }

    add(type:ClassTypes) {
        console.log('Engine Adding: ', type);
    }

    loop() {
        console.log(this.time.fps);
        this.time.step();

        this.animationId = requestAnimationFrame(bind(this.loop,this))
    }

    start() {
        this.animationId = requestAnimationFrame(bind(this.loop,this))
    }

    stop() {
        cancelAnimationFrame(this.animationId)
    }
}

    

export default GameEngine