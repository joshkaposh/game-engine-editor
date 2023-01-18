import Depth1  from "./Depth1";
import Depth2 from "./Depth2";
import Depth3 from './Depth3'

export type ClassTypes = typeof objects
export type ClassKeys = keyof typeof objects

export type Configs = ReturnType<typeof objects[ClassKeys]['editor']['config']>

const objects = {
    Depth1,
    Depth2,
    Depth3,
}

export default objects