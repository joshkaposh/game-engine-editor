import type { Component } from "solid-js";

const CreateGameObjectBtn: Component<{
    onCreate: () => void;
    type: string;
}> = (props) => {
    return <button type="submit" onclick={(e) => {
        e.preventDefault();
        props.onCreate();
    }}>Create {props.type}</button>
    }
export default CreateGameObjectBtn
