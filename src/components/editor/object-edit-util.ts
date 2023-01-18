import { createStore, SetStoreFunction,produce } from "solid-js/store";
import type { Paths } from "./EditObject";
import objects, { ClassKeys } from "../../objects";
export class ObjectBuilder {
    #root!: {[key:string]:any};
    #type!: ClassKeys;
    #paths!: Paths;
    #setPaths!: SetStoreFunction<Paths>

    get root() {
    return this.#root;
    }

    getPath(key:string) {
        return this.#paths[key]
    }
    
    setDefaultConfig(type:ClassKeys) {
        this.#type = type;
        this.#root = objects[type].editor.config();
        const [paths, setPaths] = createStore<Paths>({})
        this.#paths = paths;
        this.#setPaths = setPaths;
        setRootKeys(this.#root, setPaths)
        console.log('Builder set defaultConfig to %s', type);
        console.table(this.#root)
    }

    switchObjectConfig(type: ClassKeys) {
        console.log('Builder switching object type: %s',type);
        
        if (type === this.#type) {
            //* do nothing
            return;
        }
        this.setDefaultConfig(type)
    }

    addToPath(rootKey: string, propertyKey: string) {
        this.#setPaths(produce((paths => {
            paths[rootKey].push(propertyKey)
        })))
        console.log('Builder: Paths',this.#paths);
        
    }

    resetPaths() {
        const [paths,setPaths] = createStore<Paths>({})
        this.#paths = paths;
        this.#setPaths = setPaths
    }

    edit(key: string, value: string | number | boolean,rootKey?:string) {
        if (!rootKey) {
            this.#editProperty(key, value)
            return;
        }
        this.#editPropertyPath(rootKey,key,value)
    }

    #editProperty(key:string,value:unknown) {
        this.#root[key] = value
    }
    #editPropertyPath = (rootKey: string, key: string, value: string | number | boolean) => {
        const path = this.#paths[rootKey]
        console.log('EditProperty::', rootKey, key, value);
        console.log('EditProperty:: Paths',this.#paths);

        if (path.length === 0) {
            this.#root[rootKey][key] = value
            return;   
        }
        let temp = this.#root[rootKey]
        for (let i = 0; i < path.length; i++) {
            temp = temp[path[i]]
        }
        temp[key] = value;
        console.log('EditPropery::Root',this.#root);
    
    }

    build() {
        console.log('---Building Object---');
        // console.table(this.#root);
        objects[this.#type]['editor'].create(this.#root as any)
        
    }
}


export const setRootKeys = (root:{[key:string]:any},setPaths:SetStoreFunction<Paths>) => {
    const entries = Object.entries(root)
    for (const entry of entries) {
        if (canRecurse(entry[1])) {
            setPaths(entry[0],[])
        }
    }
}

export const canRecurse = (property: unknown) => typeof property === 'object' && !Array.isArray(property)

