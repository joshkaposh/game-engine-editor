import Depth1 from "./Depth1";
import Rect from "./Rect";
import GameObject from "../game-engine/game-object";
import { createStore } from "solid-js/store";

export type ClassKeys = keyof typeof objects
export type ClassTypes = ReturnType<typeof arrays[0][1][1]>
export type Configs = ReturnType<typeof arrays[0][1][0]>

const arrays = [
    Depth1,
    Rect
]

const dict = [
    [Depth1[0].name, Depth1[0]],
    [Rect[0].name, Rect[0]],
] as const;

const names = [
    Depth1[0].name,
    Rect[0].name
] as const;

const objects = {
    Depth1,
    Rect,
}

function toLengthSignals() {
    const entries = Object.entries(objects)
    const return_value = createStore<{[key:string]: number}>({})
    for (let i = 0; i < entries.length; i++) {
        return_value[1](entries[i][0],0)
    }
    
    return return_value;
}

export function toArray() {
    const entries = Object.entries(objects)
    const array: [[GameObject['goName'], GameObject]] | [] = []
    for (let i = 0; i < entries.length; i++) {
        console.log(entries[i]);
        
    }
}

export function toDict() {
    const entries = Object.entries(objects)
    const dict:{[key:string]: GameObject[]} = {}
    for (let i = 0; i < entries.length; i++) {
        dict[entries[i][0]] = []
    }
    return [dict,toLengthSignals()] as const
}   

export default objects