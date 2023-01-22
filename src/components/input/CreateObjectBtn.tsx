import type { Component } from "solid-js";
import type { ClassKeys,ClassTypes } from "../../objects";
import type { FormProps } from "../editor/EditObjectForm";
import objects from "../../objects";
import ObjectBuilder from "../editor/ObjectBuilder";

const CreateObjectBtn: Component<FormProps> = (props) => {
    return <button type="submit" onclick={(e) => {
        e.preventDefault();
        console.log('CREATE::', props.type, props.builder.root);
        props.add(objects[props.type]['editor'].create(props.builder.root as any))
    }}
    >
        Create {props.type}
    </button>
}

export default CreateObjectBtn
