import type { Component } from "solid-js";
import type { Configs } from "../../objects";

const CreateGameObjectBtn: Component<{
    onCreate: () => void;
    config:Configs
    type: string;
}> = (props) => {
    return <button type="submit" onclick={(e) => {
        e.preventDefault();
        props.onCreate();
    }}>Create {props.type}</button>
    }
export default CreateGameObjectBtn
