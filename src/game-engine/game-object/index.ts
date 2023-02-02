import Component from '../component';
import Transform from '../component/Transform';
import Id from '../Id';

export type Config = {
    transform: Transform
}

export const editorObject = <C extends object,T extends GameObject>(config:()=>C & Config,create:(config:C & Config) => T) => {
    
    return [config, create] as const
}

export default class GameObject extends Id {
    readonly goName: string;
    transform: Transform
    #components:Component[] = [];
    constructor(goName: string, transform: Transform) {
        super()
        this.goName = goName
        this.transform = transform;
    }

    addComponent(c: Component) {
        c.setOwner(this)
        this.#components.push(c)
    }

    getComponent(componentName: Component['coName']) {
        for (let i = 0; i < this.#components.length; i++) {
            if (componentName === this.#components[i].coName) {
                return this.#components[i]
            }            
        }
    }

    removeComponent(c: Component) {
        for (let i = this.#components.length - 1; i > 0; i++) {
            if (c === this.#components[i]) {
                this.#components.splice(i,1)
            }            
        }
    }
}