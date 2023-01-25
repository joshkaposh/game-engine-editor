import type { Component } from "solid-js";
import type { ClassKeys } from "../../objects";
import { For } from "solid-js";

const SelectObject: Component<{
    select: (type: ClassKeys) => void;
    types:string[]
}> = (props) => {

    return <ul>
        <For each={props.types}>{(type) => {
            return <li>
                <button onclick={(e) => {
                e.preventDefault();
                props.select(type as ClassKeys)
                }}>{type}</button>
            </li>
        }}
        </For>
    </ul>
        
}

export default SelectObject;