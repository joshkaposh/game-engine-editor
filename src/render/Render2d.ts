import { RectMesh } from "../objects/RectMesh";
import Pencil from "./Pencil";

export default class Render2d {
    #pencil!: Pencil;

    init(canvas: HTMLCanvasElement) {
        this.#pencil = new Pencil(canvas);
    }

    render(meshes: RectMesh[]) {
        this.#pencil.clear(0,0,this.#pencil.canvas.width,this.#pencil.canvas.height)
        for (let i = 0; i < meshes.length; i++) {
            meshes[i].draw(this.#pencil)            
        }
    }
}