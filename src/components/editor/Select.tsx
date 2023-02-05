import type { Component } from "solid-js";
import { For } from "solid-js";

const Select: Component<{
    select: (type: string) => void;
    types: string[]
}> = (props) => {
    return <ul id='select'>
        <For each={props.types}>{(type) => {
            return <li>
                <button onclick={(e) => {
                    e.preventDefault();
                    props.select(type)
                }}>{type}</button>
            </li>
        }}
        </For>
    </ul>

}

export default Select;