import type {  Setter } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type { Paths } from "./form/EditObjectForm";
import type { ClassKeys,ClassTypes } from "../../objects";
import type { Config } from "../../game-engine/game-object";
import { createStore, produce } from "solid-js/store";
import objects from "../../objects";

export type SetBuilder = Setter<ObjectBuilder | undefined>;

const setPathKeys = (root:{[key:string]:any},setPaths:SetStoreFunction<Paths>) => {
    const entries = Object.entries(root)
    for (const entry of entries) {
        if (canRecurse(entry[1])) {
            setPaths(entry[0],[])
        }
    }
}

export const canRecurse = (property: unknown) => typeof property === 'object' && !Array.isArray(property)
export const canEdit = (key:string) => key !== 'id' && key !== 'goName' && key !== 'coName'
type Root = Config & { [key: string]: any }

export default class ObjectBuilder {
    #type!: ClassKeys;
    #root!: Root;
    #paths!: Paths;
    #setPaths!: SetStoreFunction<Paths>

    private constructor(type: ClassKeys | ClassTypes, options?: {
        previous?: ObjectBuilder,
    }) {
        this.#setDefaultConfig(type);

        if (options) {
            if (options.previous) {
                this.#copy(options.previous)
            }
        }
    }

    get paths() {
        return this.#paths;
    }

    get type() {
        return this.#type
    }

    get root() {
        return this.#root;
    }

    build() {
        return objects[this.#type][1][1](this.#root as any)
    }

    static new(type: ClassKeys) {
        return new ObjectBuilder(type)
    }
    
    static edit(type: ClassTypes) {
        return new ObjectBuilder(type)
    }
    
    static keep(builder: ObjectBuilder) {
        return new ObjectBuilder(builder.type, { previous: builder })
    }

    static repeat(builder: ObjectBuilder,add:(type:ClassTypes)=>void,{ count, gap }: { count: number, gap: { x: number; y:number}}) {
        console.log('Count = ',count);
        console.log('Gap.x = %s, Gap.y = %s',gap.x,gap.y);
        let temp = builder;
        for (let i = 1; i <= count; i++) {
            console.log('Before', temp.root);
            add(temp.build())
            temp = ObjectBuilder.keep(builder)
            temp.offset(gap.x * i, gap.y * i)
            console.log('After', temp.root);
        }
        console.log(builder.root);
    }

    offset(x:number,y:number) {
        this.#root.transform.pos.addX(x) 
        this.#root.transform.pos.addY(y)
    }

    edit(key: string, value: string | number | boolean,rootKey?:string) {
        if (!rootKey) {
            this.#editProperty(key, value)
            return;
        }
        this.#editPropertyPath(rootKey,key,value)
    }

    addToPath(rootKey: string, entry: [string,unknown]) {
        this.#setPaths(produce(
            paths => paths[rootKey].push(entry[0])
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

    #setDefaultConfig(type: ClassKeys | ClassTypes) {
        if (typeof type === 'string') {
            this.#type = type;
            this.#root = objects[type][1][0]()
            this.#resetPaths()
            return
        }
        this.#type = type.goName as ClassKeys;
        this.#root = type;
        this.#resetPaths()
        
    }

    #resetPaths() {
        const [paths,setPaths] = createStore<Paths>({})
        this.#paths = paths;
        this.#setPaths = setPaths
        setPathKeys(this.#root, setPaths)
        console.log('Reset::',this.#paths);
        
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
        console.log('Temp:',temp);
        
        for (let i = 0; i < path.length; i++) {
            console.log(path[i]);
            temp = temp[path[i]]
            console.log('Temp:',temp);
        }
        temp[key] = value;
    }
}
