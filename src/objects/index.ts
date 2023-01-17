import { Indexable } from "../components/editor/EditObject";
import Depth1,{EditorDepth1} from "./Depth1";
import Depth2, { EditorDepth2 } from "./Depth2";
import Depth3,{EditorDepth3} from './Depth3'
// type Configs = ReturnType<typeof EditorDepth2.config>
export type ClassTypes = typeof objects
export type ClassKeys = keyof typeof objects

export type EditorTypes = typeof editors;
export type EditorKeys = keyof EditorTypes;

export type Configs = ReturnType<typeof editors[ClassKeys]['config']>

// type Editors = {
//     [Property in keyof ClassTypes as `Editor${Property}`]: typeof objects[Property]
// }


// type Configs = {
//     [Property in keyof typeof editors as `config${Property}`]:ReturnType<typeof editors[Property]['config']>
// }

const objects = {
    Depth1,
    Depth2,
    Depth3
}

export const editors: {
    [key: string]: Indexable
} = {
    Depth1:EditorDepth1,
    Depth2:EditorDepth2,
    Depth3:EditorDepth3,
}

export default objects