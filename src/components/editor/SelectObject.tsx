import type { Component } from "solid-js";
import { For } from "solid-js";
import type { ClassKeys } from "../../objects";

const SelectObject: Component<{
    objects: object
    select: (type:ClassKeys) => void;
}> = ({objects,select}) => {

    return <ul>
        <For each={Object.keys(objects)}>{(type) => {
            return <li><button onclick={(e) => {
                e.preventDefault();
                select(type as ClassKeys)
            }}>{type}</button></li>
        }}
        </For>
    </ul>
        
}

export default SelectObject;