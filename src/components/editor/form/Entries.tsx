import type { Component } from "solid-js"
import { For } from "solid-js";
import ObjectBuilder from "../ObjectBuilder"
import MatchPrimitives from "./input/Primitives";

const Entries: Component<{
    builder: ObjectBuilder
    fields: {
        path: string[],
        value: unknown
    }[]
}> = (props) => {

    return <div class='form-entries'>
        <For each={props.fields}>{(field) => {

            return <div>
                <label>{field.path}</label>
                <MatchPrimitives
                    field={field}
                    relay={(key, value) => {
                        props.builder.updateProperty(field.path, key, value)
                    }}
                />
            </div>
        }}</For>
    </div>
}

export default Entries