import GameObject,{EditorObject} from "./object/GameObject";

type Depth1Config = {
    color: string;
    radius: number;
    visible: boolean;
}

class Depth1 extends GameObject {
    color: string;
    radius: number;
    visible: boolean;
    constructor(color:string,radius:number,visible:boolean) {
        super();
        this.color = color;
        this.radius = radius;
        this.visible = visible;
    }
}

export default {
    obj: Depth1,
    editor: new EditorObject({
        create: (config: Depth1Config) => new Depth1(config.color, config.radius, config.visible),
        config:(): Depth1Config => ({color:'black',radius:5,visible:true})
    })
}