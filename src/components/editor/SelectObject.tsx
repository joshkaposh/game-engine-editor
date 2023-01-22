import type { Component } from "solid-js";
import type { ClassKeys } from "../../objects";
import { For } from "solid-js";
import objects from "../../objects";
import GameEngine from "../../game-engine/initialize";

const SelectObject: Component<{
    select: (type: ClassKeys) => void;
    engine:GameEngine;
}> = (props) => {

    return <ul>
        <For each={Object.keys(objects)}>{(type) => {
            return <li>
                <button onclick={(e) => {
                e.preventDefault();
                props.select(type as ClassKeys)
                }}>{type}</button>
                {props.engine.lengthStore[type]}
            </li>
        }}
        </For>
    </ul>
        
}

export default SelectObject;