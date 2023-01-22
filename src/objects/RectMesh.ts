import GameObject,{EditorObject} from "./object/GameObject";
import t from "./Transform";
import Vect2 from "../vector/Vect2";
import Pencil from "../render/Pencil";
const { obj: Transform } = t

type TTransform = ReturnType<typeof t['editor']['create']> 

type RectMeshConfig = {
    transform: TTransform;
    size: Vect2;
    color: string;
}

export const editor = new EditorObject({
    create: (config) => new RectMesh(config.transform,config.size,config.color),
    config:() => ({transform:new Transform(new Vect2(0,0)),size:new Vect2(25,25),color:'#cecece'}) satisfies RectMeshConfig
})

export class RectMesh extends GameObject implements RectMeshConfig {
    transform: TTransform;
    size: Vect2;
    color: string;
    constructor(transform: TTransform,size:Vect2,color:string) {
        super(RectMesh.name);
        this.transform = transform;
        this.size = size;
        this.color = color;
    }

    draw(pencil: Pencil): void {
        pencil.fill = this.color;
        pencil.rect(this.transform.pos.x,this.transform.pos.y,this.size.x,this.size.y,true)
    }

}

export default {
    obj: RectMesh,
    editor
}