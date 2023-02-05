import GameObject, { Config, editorObject } from "../game-engine/game-object";
import Transform from "../game-engine/component/Transform";
import Vect2 from "../game-engine/vector/Vect2";
import Pencil from "../game-engine/render/Pencil";
import Component from "../game-engine/component";

type RectConfig = Config & {
    size: Vect3;
    color: string;
}

class Vect3 {
    x: number;
    y: number;
    z: number;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class RectMesh extends Component {
    transform: Transform;
    size: Vect2;
    color: string;

    constructor(transform: Transform, size = new Vect2(25, 25), color = '#fff') {
        super(RectMesh.name);
        this.transform = transform
        this.size = size;
        this.color = color;
    }

    draw(pencil: Pencil): void {
        pencil.fill = this.color;
        pencil.rect(this.transform.pos.x, this.transform.pos.y, this.size.x, this.size.y, true)
    }
}

class Rect extends GameObject {
    size: Vect3;
    color: string;
    constructor(transform: Transform, size: Vect3, color: string) {
        super(Rect.name, transform);
        this.size = size;
        this.color = color;
        this.addComponent(new RectMesh(transform))
    }
    draw(pencil: Pencil): void {
        pencil.fill = this.color;
        pencil.rect(this.transform.pos.x, this.transform.pos.y, this.size.x, this.size.y, true)
    }
}

// TODO: make config optional and add transform in later
export default [
    Rect,
    editorObject<RectConfig, Rect>(
        () => {
            return {
                transform: new Transform(),
                size: new Vect3(25, 25, 25),
                color: '#ffffff',
            }
        },
        (config) => new Rect(config.transform, config.size, config.color),
    )
] as const