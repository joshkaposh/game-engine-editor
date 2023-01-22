import { Mesh } from "../objects/Mesh";
import Pencil from "./Pencil";

export default class Render2d {
    #pencil!: Pencil;
    constructor() {
        // this.#pencil = new Pencil(canvas);
    }

    init(canvas: HTMLCanvasElement) {
        this.#pencil = new Pencil(canvas);
    }

    drawMeshes(meshes:Mesh[]) {
        for (let i = 0; i < meshes.length; i++) {
            meshes[i].draw(this.#pencil)            
        }
    }
}