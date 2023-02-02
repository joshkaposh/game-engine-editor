import type { Component } from "solid-js";
import type { ClassKeys } from "../../objects";
import { For } from "solid-js";

const Select: Component<{
    select: (type: ClassKeys) => void;
    types:string[]
}> = (props) => {
    return <ul id='select'>
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

export default Select;