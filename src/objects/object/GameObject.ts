import {v4 as uuidv4} from 'uuid'

export class EditorObject<T extends GameObject,C extends object> {
    #createFn:(config:C) => T
    #configFn: () => C
    // TODO: add functionality to save edited config
    
    constructor({create,config}:{create:(config:C) => T, config: () => C}) {
        this.#createFn = create;
        this.#configFn = config;
    }
    create(config:C) {
        return this.#createFn(config)
    }
    config() {
        return this.#configFn();
    }
}

export default class GameObject {
    id: string;
    readonly goName: string;
    constructor(goName:string,id?:string) {
        this.goName = goName;
        this.id = id || uuidv4();
    }
}