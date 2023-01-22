import GameObject,{EditorObject} from "./object/GameObject";
import t from "./Transform";
import Vect2 from "../vector/Vect2";
import Pencil from "../render/Pencil";
const { obj: Transform } = t

type TTransform = ReturnType<typeof t['editor']['create']> 

type MeshConfig = {
    transform: TTransform;
    color: string;
}

export const editor = new EditorObject({
    create: (config) => new Mesh(config.transform,config.color),
    config:{transform:new Transform(new Vect2(0,0)),color:'black'} satisfies MeshConfig
})

export class Mesh extends GameObject implements MeshConfig {
    transform: TTransform;
    color: string;
    constructor(transform: TTransform,color:string) {
        super();
        this.transform = transform;
        this.color = color;
    }

    draw(pencil: Pencil): void {
        
    }

}

export default {
    obj: Mesh,
    editor
}