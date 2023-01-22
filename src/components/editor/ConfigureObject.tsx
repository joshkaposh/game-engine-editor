import type { Component, Accessor } from "solid-js";
import type { ClassKeys,ClassTypes } from "../../objects";
import ObjectBuilder from "./ObjectBuilder";
import EditObjectForm from "./EditObjectForm";

const ConfigureObject: Component<{
    builder: ObjectBuilder;
    select: (type: ClassKeys) => void;
    selected: Accessor<ClassKeys | undefined>
    create: (type: ClassTypes) => void;
}> = (props) => {
    return <>
        <EditObjectForm
            type={props.selected()!}
            builder={props.builder!}
            create={props.create}
        />
    </>
}

export default ConfigureObject;
