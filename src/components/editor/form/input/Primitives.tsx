import type { Component,Accessor } from "solid-js";
import { Match } from "solid-js";
import { Field,Color,Text,Number,Boolean } from "./Input";


const MatchPrimitives: Component<{
    entry: [string, any];
    relay: (value:Accessor<string | number | boolean>) => void;
}> = (props) => {

    return (<>
        <Match when={props.entry[0] === 'color'}>
            <Field input={<Color initialValue={props.entry[1]} relay={(value) => props.relay(value)} />} />
        </Match>
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