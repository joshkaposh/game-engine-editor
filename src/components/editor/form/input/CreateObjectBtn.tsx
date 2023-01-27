import type { Component,Accessor  } from "solid-js";
import { Button } from "./Input";

const CreateObjectBtn: Component<{
    mode: Accessor<'Create' | 'Repeat' | 'Edit'>;
    handleCreate: () => void;
}> = (props) => {

    return <Button type="submit" handleClick={(e) => {
        e.preventDefault();
        props.handleCreate();
    }}>
        {props.mode() === 'Edit' ? 'Finish' : props.mode()}
    </Button>
}

export default CreateObjectBtn
