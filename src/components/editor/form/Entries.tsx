import type { Component } from "solid-js"
import { For, Index } from "solid-js";
import ObjectBuilder, { normalizeKey } from "../ObjectBuilder"
import Primitives from "./input/Primitives";

const Entries: Component<{
    builder: ObjectBuilder
    fields: ([string, string, unknown] | [string, string[], unknown[]])[];
}> = (props) => {
    return <For each={props.fields}>{(field) => {
        return <div class='form-entry'>
            {!Array.isArray(field[1]) && !Array.isArray(field[2]) ?
                <Primitives
                    key={field[1]}
                    initialValue={field[2]}
                    relay={(key, value) => {
                        console.log(field[0], key, value);
                        let normal = field[0] !== '' ?
                            normalizeKey(field[0])
                            : ''
                        props.builder.updateProperty(normal, key, value)
                    }}
                />
                :
                <>
                    <label>{field[0]}</label>
                    <Index each={field[2] as unknown[]}>{(item, i) => {
                        return <Primitives
                            initialValue={item()}
                            key={field[1][i]}
                            relay={(key, value) => {
                                console.log(field[0], key, value);
                                let normal = field[0] !== '' ?
                                    normalizeKey(field[0])
                                    : ''
                                props.builder.updateProperty(normal, key, value)
                            }} />
                    }}</Index>
                </>
            }
        </div>
    }}
    </For>
}

export default Entries