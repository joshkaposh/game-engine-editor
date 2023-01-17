import {v4 as uuidv4} from 'uuid'


export type EditorObject<T extends GameObject, C extends object> = {
    create: (config: C) => T
    config:() => C
}

export default class GameObject {
    
    id: string;
    constructor(id?:string) {
        this.id = id || uuidv4();
    }
}