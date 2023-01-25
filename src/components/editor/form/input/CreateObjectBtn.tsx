import type { Accessor, Component, Setter } from "solid-js";
import type { FormProps,Modes } from "../EditObjectForm";
import ObjectBuilder, { SetBuilder } from "../../ObjectBuilder";

const CreateObjectBtn: Component<FormProps & {
    mode: Accessor<Modes>;
    setMode: Setter<Modes>;
    setBuilder: SetBuilder;
    resetIndex: () => void;
}> = (props) => {
    return <button type="submit" onclick={(e) => {
        e.preventDefault();
        if (props.mode() === 'Edit') {
            //! get config of type
            props.setBuilder(new ObjectBuilder(props.type))
            props.setMode('Create')
            props.resetIndex();
            return;
        }
        props.create(props.builder.build())

    }}
    >
        {props.mode() === 'Create' ? props.mode() : 'Finish'}
    </button>
}

export default CreateObjectBtn
