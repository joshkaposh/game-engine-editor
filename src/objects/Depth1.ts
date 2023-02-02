import Transform from "../game-engine/component/Transform";
import GameObject,{editorObject,Config} from "../game-engine/game-object";

type Depth1Config = Config & {
    color: string;
    radius: number;
    visible: boolean;
} 

class Depth1 extends GameObject implements Depth1Config {
    color: string;
    radius: number;
    visible: boolean;
    constructor(transform:Transform,color:string,radius:number,visible:boolean) {
        super(Depth1.name,transform);
        this.color = color;
        this.radius = radius;
        this.visible = visible;
    }
}

export default [
    Depth1,
    editorObject(
        () => ({
            transform:new Transform(),
            color: '#cecece',
            radius: 5,
            visible: true
    } satisfies Depth1Config),
        (config) => (
            new Depth1(new Transform(),config.color, config.radius, config.visible)
        )
    )
] as const