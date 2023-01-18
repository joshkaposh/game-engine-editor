import {v4 as uuidv4} from 'uuid'

export class EditorObject<T extends GameObject,C extends object> {
    #createFn:(config:C) => T
    #config: C
    
    constructor({create,config}:{create:(config:C) => T, config: C}) {
        this.#createFn = create;
        this.#config = config;
    }
    create(config:C) {
        return this.#createFn(config)
    }
    config() {
        return this.#config;
    }
}

export default class GameObject {
    id: string;
    constructor(id?:string) {
        this.id = id || uuidv4();
    }
}