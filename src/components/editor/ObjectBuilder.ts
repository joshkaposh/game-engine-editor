import { createStore, SetStoreFunction,produce } from "solid-js/store";
import type { Paths } from "./form/EditObjectForm";
import objects, { ClassKeys,Configs } from "../../objects";

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

    constructor(type:ClassKeys,previous?:ObjectBuilder) {
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
        console.log('-Edit-',key,value,rootKey ?? 'None');
        
        if (!rootKey) {
            this.#editProperty(key, value)
            return;
        }
        this.#editPropertyPath(rootKey,key,value)
    }

    addToPath(rootKey: string, propertyKey: string) {
        this.#setPaths(produce((paths => {
            paths[rootKey].push(propertyKey)
        })))
    }

    #copy(previous: ObjectBuilder) {
        const rEntries = Object.entries(previous.root);

        for (let i = 0; i < rEntries.length; i++) {
            const key = rEntries[i][0]
            const value = rEntries[i][1]
            if (!canRecurse(value)) {
                if (canEdit(key)) {
                this.#editPrevious(previous.paths,key,value)
                }
                } else {
                //! need to find path to primitive value
                this.#_copy(previous, value,key)
            }
        }
    }

    #_copy(previous:ObjectBuilder,value:object,rootKey:string) {
        const temp = Object.entries(value);
        for (let i = 0; i < temp.length; i++) {
            if (canRecurse(temp[i][1]) && canEdit(temp[i][0])) {
                this.#_copy(previous,temp[i][1],rootKey)
            } else {
                console.log('Found Primitive! [%s] = %s',temp[i][0],temp[i][1]);
                console.log('Rootkey:',rootKey);
                this.#editPrevious(previous.paths,temp[i][0], temp[i][1], rootKey)
            }
        }
        
    }

    #setDefaultConfig(type:ClassKeys) {
        this.#type = type;
        this.#root = objects[type].editor.config();
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
        console.log('#editPropertPath',rootKey,key,value);
        console.log('#editPropertyPath path: ',path);
        console.log(path.length);

        if (path.length === 0) {
            console.log('Path length is ZEROOOOOOOOOO');
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
