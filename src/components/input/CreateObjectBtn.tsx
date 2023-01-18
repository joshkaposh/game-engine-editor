import type { Component } from "solid-js";
import type { ClassKeys } from "../../objects";
import objects from "../../objects";
import { ObjectBuilder } from "../editor/object-edit-util";

const CreateObjectBtn: Component<{
    type: ClassKeys;
    builder: ObjectBuilder;
}> = (props) => {
    return <button type="submit" onclick={(e) => {
            e.preventDefault();
            console.log('CREATE::', props.type, props.builder.root);
            console.log(objects[props.type]['editor'].create(props.builder.root as any))
        }}
    >
        Create {props.type}
    </button>
}

export default CreateObjectBtn
