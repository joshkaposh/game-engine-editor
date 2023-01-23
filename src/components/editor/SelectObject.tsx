import type { Component } from "solid-js";
import type { ClassKeys } from "../../objects";
import { For,Show } from "solid-js";
import GameEngine from "../../game-engine/initialize";

const SelectObject: Component<{
    select: (type: ClassKeys) => void;
    types:string[]
    // engine:GameEngine;
}> = (props) => {

    return <ul>
        <For each={props.types}>{(type) => {
            return <li>
                <button onclick={(e) => {
                e.preventDefault();
                props.select(type as ClassKeys)
                }}>{type}</button>
                {/* <Show when={props.engine.lengthStore[type] > 0}>
                    {props.engine.lengthStore[type]}
                </Show> */}
            </li>
        }}
        </For>
    </ul>
        
}

export default SelectObject;