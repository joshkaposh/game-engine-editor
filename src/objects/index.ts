import Depth1  from "./Depth1";
import Depth2 from "./Depth2";
import Depth3 from './Depth3'
import Transform from "./Transform";
import RectMesh from "./RectMesh";
import GameObject from "./object/GameObject";
import { createStore } from "solid-js/store";

export type ObjectTypes = typeof objects
export type ClassKeys = keyof typeof objects

export type ClassTypes = ReturnType<typeof objects[ClassKeys]['editor']['create']>
export type Configs = ReturnType<typeof objects[ClassKeys]['editor']['config']>


const objects = {
    Depth1,
    Depth2,
    Depth3,
    Transform,
    RectMesh,
}

function toLengthSignals() {
    const entries = Object.entries(objects)
    const return_value = createStore<{[key:string]: number}>({})
    for (let i = 0; i < entries.length; i++) {
        // [entries[i][0]] = 0
        return_value[1](entries[i][0],0)
    }
    console.log('return_value: ',return_value);
    
    return return_value;
}

export function toArrays() {
    const entries = Object.entries(objects)
    const dict:{[key:string]: GameObject[]} = {}
    for (let i = 0; i < entries.length; i++) {
        dict[entries[i][0]] = []
    }
    return {dict,lengths:toLengthSignals()}
}   

export default objects