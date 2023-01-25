import type { Setter } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type { Paths } from "./form/EditObjectForm";
import type { ClassKeys,ClassTypes,Configs } from "../../objects";
import { createStore, produce } from "solid-js/store";
import objects  from "../../objects";

export type SetBuilder = Setter<ObjectBuilder | undefined>;

export const setRootKeys = (root:{[key:string]:any},setPaths:SetStoreFunction<Paths>) => {
    const entries = Object.entries(root)
    for (const entry of entries) {
        if (canRecurse(entry[1])) {
            setPaths(entry[0],[])
        }
    }
}

export const canRecurse = (property: unknown) => typeof property === 'object' && !Array.isArray(property)
export const canEdit = (key:string) => key !== 'id' && key !== 'goName'

export default class ObjectBuilder {
    #root!: Configs & {[key:string]:any};
    #type!: ClassKeys;
    #paths!: Paths;
    #setPaths!: SetStoreFunction<Paths>

    constructor(type:ClassKeys | ClassTypes,previous?:ObjectBuilder) {
        this.#setDefaultConfig(type);

        if (previous) {
            this.#copy(previous)
        }
    }

    get paths() {
        return this.#paths;
    }

    get root() {
    return this.#root;
    }

    build() {
        return objects[this.#type]['editor'].create(this.#root as any)
    }

    edit(key: string, value: string | number | boolean,rootKey?:string) {
        if (!rootKey) {
            this.#editProperty(key, value)
            return;
        }
        this.#editPropertyPath(rootKey,key,value)
    }

    addToPath(rootKey: string, propertyKey: string) {
        this.#setPaths(produce(
            paths => paths[rootKey].push(propertyKey)
        ))
    }

    #copy(previous: ObjectBuilder) {
        const rEntries = Object.entries(previous.root);
        for (let i = 0; i < rEntries.length; i++) {
            const key = rEntries[i][0]
            const value = rEntries[i][1]
            if (canEdit(key) && !canRecurse(value)) {
                this.#editPrevious(previous.paths,key,value)
            } else this.#_copy(previous, value,key)
        }
    }

    #_copy(previous:ObjectBuilder,value:object,rootKey:string) {
        const temp = Object.entries(value);
        for (let i = 0; i < temp.length; i++) {
            if (canRecurse(temp[i][1]) && canEdit(temp[i][0])) {
                this.#_copy(previous,temp[i][1],rootKey)
            } else {
                this.#editPrevious(previous.paths,temp[i][0], temp[i][1], rootKey)
            }
        }
        
    }

    #setDefaultConfig(type:ClassKeys | ClassTypes) {
        if (typeof type === 'string') {
            this.#type = type;
            this.#root = objects[type].editor.config();
            this.#resetPaths()
            return
        }
        this.#type = type.goName as ClassKeys;
        this.#root = type as Configs;
        this.#resetPaths()
        
    }

    #resetPaths() {
        const [paths,setPaths] = createStore<Paths>({})
        this.#paths = paths;
        this.#setPaths = setPaths
        setRootKeys(this.#root, setPaths)
    }

    #editPrevious(paths:Paths,key: string, value: string | number | boolean,rootKey?:string) {
        if (!rootKey) {
            this.#editProperty(key,value)
            return;
        }
        this.#editPropertyPath(rootKey,key,value,paths[rootKey])       
    }

    #editProperty(key:string,value:unknown) {
        this.#root[key] = value
    }

    #editPropertyPath(rootKey: string, key: string, value: string | number | boolean,path = this.#paths[rootKey]) {
        if (path.length === 0) {
            this.#root[rootKey][key] = value
            return;   
        }
        let temp = this.#root[rootKey]
        for (let i = 0; i < path.length; i++) {
            temp = temp[path[i]]
        }
        temp[key] = value;
    }
}
