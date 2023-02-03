import type {  Setter } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type { Paths } from "./form/EditObjectForm";
import type { ClassKeys,ClassTypes } from "../../objects";
import type { Config } from "../../game-engine/game-object";
import { createStore, produce } from "solid-js/store";
import objects from "../../objects";

type Indexable = { [key: string]: any }
type Root = Config & Indexable
export type SetBuilder = Setter<ObjectBuilder | undefined>;

const setPathKeys = (root:{[key:string]:any},setPaths:SetStoreFunction<Paths>) => {
    const entries = Object.entries(root)
    for (const entry of entries) {
        if (canRecurse(entry[1])) {
            setPaths(entry[0],[])
        }
    }
}

const primitives = (entry:[string,unknown]) => {
    if (entry[0] === 'color' ||
        typeof entry[1] === 'string' ||
        typeof entry[1] === 'number' || 
        typeof entry[1] === 'boolean'
    ) {
        return true;
    }
    return false;
}
export const canRecurse = (property: unknown) => typeof property === 'object' && !Array.isArray(property)
export const canEdit = (key:string) => key !== 'id' && key !== 'goName' && key !== 'coName'


class D {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}


class C {
    d1: D;
    d2: D;
    constructor(d1:D,d2:D) {
        this.d1 = d1;
        this.d2 = d2;
    }
}

class B {
    c1:C; 
    c2:C
    constructor(c1:C,c2:C) {
        this.c1 = c1;
        this.c2 = c2
    }
}

const a = {
    b1: new B(
        new C(
            new D('b1-c1-d1-value'),
            new D('b1-c1-d2-value')
        ),
        new C(
            new D('b1-c2-d3-value'),
            new D('b1-c2-d4-value')
        ),
    ),
    b2: new B(
        new C(
            new D('b2-c1-d5-value'),
            new D('b2-c1-d6-value')
        ),
        new C(
            new D('b2-c2-d7-value'),
            new D('b2-c2-d8-value')
        ),
        )
}

const flatten = (obj: Indexable) => {
const output:Indexable = {}
const recursive = (obj: Indexable, parentKey:string) => {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            recursive(obj[key],`${parentKey}/${key}`)
        } else {
            output[`${parentKey}/${key}`] = obj[key]
        }
    }
    }
    recursive(obj, 'root')
    
    return output
}

export function createPaths(obj: Indexable): {path:string[],value:any}[] {
    const input = flatten(obj)
    const keys = Object.keys(input);
    const output = [];
    for (let i = 0; i < keys.length; i++) {
        const split = keys[i].split('/')
        if (split[0] === 'root') {
            split.shift();
        }
        output.push({
            path: split,
            value: input[keys[i]]
        }) 
    }
    return output;

}
 
const output = createPaths(a)
console.log(output)

export default class ObjectBuilder {
    #type!: ClassKeys;
    #root!: Root;
    #paths!: Paths;
    #setPaths!: SetStoreFunction<Paths>
    #paths2!: Paths;
    #setPaths2!: SetStoreFunction<Paths>

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

    get paths2() {
        return this.#paths2;
    }

    get type() {
        return this.#type
    }

    get root() {
        return this.#root;
    }

    getProperty(path: string[]) {
        console.log(path)
        let temp = this.#root
        for (let i = 0; i < path.length; i++) {
            temp = temp[path[i]]
        }
    }

    
    updateProperty(path: string[],key:string,value:any) {
        let temp = this.#root
        for (let i = 0; i < path.length - 1; i++) {
            temp = temp[path[i]]
        }
        temp[key] = value
        console.log(this.#root);
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
        // this.#setPaths2(produce(
        //     paths => {
        //         entry[1]
        //     }
        //     ))
    }

    enterObject(entry: [string,unknown]) {
        // if () {
            
        // }
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
        const [paths2,setPaths2] = createStore<Paths>({})

        this.#paths = paths;
        this.#setPaths = setPaths
        this.#paths2 = paths2;
        this.#setPaths2 = setPaths2;
        setPathKeys(this.#root, setPaths)
        setPathKeys(this.#root,setPaths2)
        console.log('resetPaths::', this.#paths);
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
