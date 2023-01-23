import type { Component } from "solid-js";
import type { FormProps } from "../EditObjectForm";

const CreateObjectBtn: Component<FormProps> = (props) => {
    return <button type="submit" onclick={(e) => {
        e.preventDefault();
        console.log('CREATE::', props.type, props.builder.root);
        props.create(props.builder.build())
    }}
    >
        Create {props.type}
    </button>
}

export default CreateObjectBtn
