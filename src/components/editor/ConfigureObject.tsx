import type { Component, Accessor } from "solid-js";
import type { ClassKeys } from "../../objects";
import ObjectBuilder from "./ObjectBuilder";
import SelectObject from "./SelectObject";
import EditObjectForm from "./EditObjectForm";

const ConfigureObject: Component<{
    builder: ObjectBuilder;
    select: (type: ClassKeys) => void;
    selected: Accessor<ClassKeys | undefined>
}> = (props) => {
    return <>
        <SelectObject select={props.select} />
        <EditObjectForm
            type={props.selected()!}
            builder={props.builder!}
        />
    </>
}

export default ConfigureObject;
