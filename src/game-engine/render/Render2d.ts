import Rect from "../../objects/Rect";
import Pencil from "./Pencil";

export default class Render2d {
    #pencil!: Pencil;

    init(canvas: HTMLCanvasElement) {
        this.#pencil = new Pencil(canvas);
    }

    render(meshes: ReturnType<typeof Rect[1][1]>[]) {
        this.#pencil.clear(0,0,this.#pencil.canvas.width,this.#pencil.canvas.height)
        for (let i = 0; i < meshes.length; i++) {
            meshes[i].draw(this.#pencil)            
        }
    }
}