import type { SetStoreFunction } from "solid-js/store";
import type { Paths } from "./form/EditObjectForm";
import type { ClassKeys, ClassTypes } from "../../objects";
import { createStore, produce } from "solid-js/store";
import objects from "../../objects";

type Indexable = { [key: string]: any }

export type Field<T extends unknown> = {
    path: string[];
    value: T;

}

export type GroupedField<T extends unknown> = {
    path: (string | string[])[];
    value: T | T[];
    remove?: boolean;
}

export type Fields<T extends unknown> = Field<T>[]
export type GroupedFields<T extends unknown> = GroupedField<T>[]

// TODO: remove
const setPathKeys = (root: { [key: string]: any }, setPaths: SetStoreFunction<Paths>) => {
    const entries = Object.entries(root)
    for (const entry of entries) {
        if (canRecurse(entry[1])) {
            setPaths(entry[0], [])
        }
    }
}

export const canRecurse = (property: unknown) => typeof property === 'object' && !Array.isArray(property)
export const canEdit = (key: string) => key !== 'id' && key !== 'goName' && key !== 'coName'

function iter_reverse<T extends any>(arr: T[], callback: (element: T, index: number) => void) {
    for (let i = arr.length - 1; i >= 0; i--) {
        callback(arr[i], i)
    }
}

const recursePaths = <T extends any>(object: object): { [key: string]: T } => {
    const output: {
        [key: string]: T
    } = {}
    function recurse(obj: Indexable, parentKey = 'root') {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                recurse(obj[key], `${parentKey}/${key}`)
            } else output[`${parentKey}/${key}`] = obj[key]
        }
    }
    recurse(object)
    return output
}

export const normalizeKey = (str: string) => {
    const split = str.split('/')
    if (split[0] === 'root') {
        split.shift();
    }
    return split;
}

const recurseGroupPaths = <T extends any>(object: object): [string, string, T][] => {
    const output: [string, string, T][] = []
    function recurse(obj: Indexable, parentKey = 'root') {
        for (let key in obj) {
            const replacement = `${parentKey}/${key}`
            if (typeof obj[key] === 'object') {
                recurse(obj[key], replacement)
            } else {
                const path = normalizeKey(replacement)
                const last = path[path.length - 1]
                path.pop();
                output.push([path.join('/'), last, obj[key]])
            }
        }
    }
    recurse(object)
    return output;
}

export function group(obj: object) {
    const paths = recurseGroupPaths(obj)
    const merge = new Map()
    const unmerged: [string, string, unknown][] = [];
    iter_reverse(paths, (current, i) => {
        if (current[0] === '') {
            unmerged.push(current)
        }
        if (i + 1 <= paths.length - 1) {
            const prev = paths[i + 1]

            if (current[0] === prev[0] && current[0] !== '') {
                if (!merge.has(current[0])) {
                    merge.set(current[0], [
                        [current[1], prev[1]],
                        [current[2], current[2]]
                    ] as const)
                } else {
                    const value = merge.get(current[0])
                    value[0].unshift(current[1])
                    value[1].unshift(current[2])
                }
            }
        }
    })
    const final: ([string, string, unknown] | [string, string[], unknown[]])[] = [];
    for (const [key, value] of merge.entries()) {
        final.push([key, value[0], value[1]])
    }
    final.reverse()
    for (const el of unmerged) {
        final.push([el[0], el[1], el[2]])
    }

    return final
}

export function createPaths<T extends unknown>(obj: object): Fields<T> {
    const paths = recursePaths(obj)
    const keys = Object.keys(paths);
    const fields: Fields<T> = []
    for (let i = 0; i < keys.length; i++) {
        const path = keys[i].split('/')
        if (path[0] === 'root') {
            path.shift();
        }
        const current = {
            path,
            value: paths[keys[i]] as T
        }
        fields.push(current)

    }

    return fields;
}

// TODO: refactor edit to take in new pathing

export default class ObjectBuilder {
    #type!: ClassKeys;
    #root!: Indexable;
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

    updateProperty(path: string | string[], key: string, value: any) {
        console.log(path);

        if (path === '') {
            console.log('ROOT', path);

            this.#root[key] = value;
            console.log(this.#root);
            return
        }
        if (!Array.isArray(path)) {
            console.log('SINGLE', path);

            this.#root[path][key] = value;
            console.log(this.#root);

        } else {
            console.log('ARRAY', path);
            let temp = this.#root
            for (let i = 0; i < path.length; i++) {
                temp = temp[path[i]]
            }
            console.log(temp);

            temp[key] = value

            console.log(this.#root);
            return;
        }

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

    static repeat(builder: ObjectBuilder, add: (type: ClassTypes) => void, { count, gap }: { count: number, gap: { x: number; y: number } }) {
        console.log('Count = ', count);
        console.log('Gap.x = %s, Gap.y = %s', gap.x, gap.y);
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

    offset(x: number, y: number) {
        this.#root.transform.pos.addX(x)
        this.#root.transform.pos.addY(y)
    }

    edit(key: string, value: string | number | boolean, rootKey?: string) {
        if (!rootKey) {
            this.#root[key] = value
            return;
        }
        this.#editPropertyPath(rootKey, key, value)
    }

    addToPath(rootKey: string, entry: [string, unknown]) {
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
                this.#editPrevious(previous.paths, key, value)
            } else this.#_copy(previous, value, key)
        }
    }

    #_copy(previous: ObjectBuilder, value: object, rootKey: string) {
        const temp = Object.entries(value);
        for (let i = 0; i < temp.length; i++) {
            if (canRecurse(temp[i][1]) && canEdit(temp[i][0])) {
                this.#_copy(previous, temp[i][1], rootKey)
            } else {
                this.#editPrevious(previous.paths, temp[i][0], temp[i][1], rootKey)
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
        const [paths, setPaths] = createStore<Paths>({})
        this.#paths = paths;
        this.#setPaths = setPaths
        setPathKeys(this.#root, setPaths)
    }

    #editPrevious(paths: Paths, key: string, value: string | number | boolean, rootKey?: string) {
        if (!rootKey) {
            this.#root[key] = value
            return;
        }
        this.#editPropertyPath(rootKey, key, value, paths[rootKey])
    }

    #editPropertyPath(rootKey: string, key: string, value: string | number | boolean, path = this.#paths[rootKey]) {

        if (path.length === 0) {
            this.#root[rootKey][key] = value
            return;
        }
        let temp = this.#root[rootKey]
        console.log('Temp:', temp);

        for (let i = 0; i < path.length; i++) {
            console.log(path[i]);
            temp = temp[path[i]]
            console.log('Temp:', temp);
        }
        temp[key] = value;
    }
}
