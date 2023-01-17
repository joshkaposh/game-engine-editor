import type { Component,Accessor, JSXElement } from "solid-js";
import { Match } from "solid-js";
import { Text,Number,Boolean } from "../../input/Input";

const Field: Component<{
    input:JSXElement
}> = (props) => {
    return <>
        {props.input}
        <br />
    </>
} 
const MatchPrimitives: Component<{
    entry: [string, any];
    relay: (value:Accessor<string | number | boolean>) => void;
}> = (props) => {

    return (<>
        <Match when={typeof props.entry[1] === 'string'}>
            <Field input={<Text initialValue={props.entry[1]} relay={(value) => props.relay(value)} />} />
        </Match>
        <Match when={typeof props.entry[1] === 'number'}>
            <Field input={<Number initialValue={props.entry[1]} relay={(value) => props.relay(value)} />} />
        </Match>
        <Match when={typeof props.entry[1] === 'boolean'}>
            <Field input={<Boolean initialValue={props.entry[1]} relay={(value) => props.relay(value)} />} />
        </Match>
    </>)
    }
export default MatchPrimitives