import { createStore, SetStoreFunction,produce } from "solid-js/store";
import type { Indexable, Paths } from "./EditObject";
import { ClassKeys, editors } from "../../objects";
export class ObjectBuilder {
    #root!: Indexable;
    #type!: ClassKeys;
    #paths!: Paths;
    #setPaths!: SetStoreFunction<Paths>

    get root() {
    return this.#root;
    }

    getPath(key:string) {
        // if (!this.#paths[key]) {
        //     throw new Error('Could not find path of type [%s]',key)
        // }
        return this.#paths[key]
    }
    
    setDefaultConfig(type:ClassKeys,root: Indexable) {
        this.#type = type;
        this.#root = root;
        const [paths, setPaths] = createStore<Paths>({})
        this.#paths = paths;
        this.#setPaths = setPaths;
        setRootKeys(this.#root, setPaths)
        console.log('Builder set defaultConfig to %s', type);
        console.table(root)
    }

    switchObjectConfig(type: ClassKeys) {
        console.log('Builder switching object type: %s',type);
        
        if (type === this.#type) {
            //* do nothing
            return;
        }
        this.setDefaultConfig(type,editors[type].config())
    }

    addToPath(rootKey:string,propertyKey:string) {
        this.#setPaths(produce((paths => {
            paths[rootKey].push(propertyKey)
        })))
        console.log('Builder: Path',this.#paths[rootKey]);
        
    }

    resetPaths() {
        const [paths,setPaths] = createStore<Paths>({})
        this.#paths = paths;
        this.#setPaths = setPaths
    }

    
    editProperty(key:string,value:unknown) {
        this.#root[key] = value
    }
    editPropertyPath = (rootKey: string, property: string, value: string | number | boolean) => {
        const path = this.#paths[rootKey]
        console.log('EditProperty::', rootKey, property, value);
        console.log('EditProperty:: Path',path);
        
        if (path.length === 0) {
            this.#root[rootKey][property] = value
            
        } else {
            let temp = this.#root[rootKey]
            for (let i = 0; i < path.length; i++) {
                temp = temp[path[i]]
            }
            temp[property] = value;
        }
        console.log('EditPropery::Root',this.#root);
    
    }

    build() {
        console.log('---Building Object---');
        console.table(this.#root);
        editors[this.#type].create(this.#root)
        
    }
}


export const setRootKeys = (root:Indexable,setPaths:SetStoreFunction<Paths>) => {
    const entries = Object.entries(root)
    for (const entry of entries) {
        if (canRecurse(entry[1])) {
            setPaths(entry[0],[])
        }
    }
}

export const canRecurse = (property: unknown) => typeof property === 'object' && !Array.isArray(property)

