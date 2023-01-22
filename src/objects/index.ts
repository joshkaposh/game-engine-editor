import Depth1  from "./Depth1";
import Depth2 from "./Depth2";
import Depth3 from './Depth3'
import Transform from "./Transform";
import Mesh from "./Mesh";

export type ObjectTypes = typeof objects
export type ClassKeys = keyof typeof objects

export type ClassTypes = ReturnType<typeof objects[ClassKeys]['editor']['create']>
export type Configs = ReturnType<typeof objects[ClassKeys]['editor']['config']>


const objects = {
    Depth1,
    Depth2,
    Depth3,
    Transform,
    Mesh,
}

export default objects