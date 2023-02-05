import type { Component } from "solid-js"
import { For } from "solid-js";
import ObjectBuilder, { normalizeKey } from "../ObjectBuilder"
import MatchPrimitives from "./input/Primitives";

const Entries: Component<{
    builder: ObjectBuilder
    fields: ([string, string, unknown] | [string, string[], unknown[]])[];
}> = (props) => {
    console.log('Entries', props.fields)
    return <div class='form-entries'>
        <For each={props.fields}>{(field) => {
            return <div class='form-entry'>
                <MatchPrimitives
                    field={field}
                    relay={(key, value) => {
                        console.log(field[0], key, value);
                        let normal = field[0] !== '' ?
                            normalizeKey(field[0])
                            : ''
                        props.builder.updateProperty(normal, key, value)
                    }}
                />
            </div>
        }}</For>
    </div>
}

export default Entries