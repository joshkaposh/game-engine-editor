import type { Accessor, Component } from "solid-js";
import { Match } from "solid-js";
import { Color,Text,Number,Boolean, RepeatField } from "./Input";

const MatchPrimitives: Component<{
    relay: (value:string | number | boolean) => void;
    entry: [string, any];
}> = (props) => {

    return (<>
        <Match when={props.entry[0] === 'color'}>
            <Color initialValue={props.entry[1]} relay={(value) => props.relay(value)} />
        </Match>
        <Match when={typeof props.entry[1] === 'string'}>
            <Text initialValue={props.entry[1]} relay={(value) => props.relay(value)} />
        </Match>
        <Match when={typeof props.entry[1] === 'number'}>
            <Number initialValue={props.entry[1]} relay={(value) => props.relay(value)} />
        </Match>
        <Match when={typeof props.entry[1] === 'boolean'}>
            <Boolean initialValue={props.entry[1]} relay={(value) => props.relay(value)} />
        </Match>
    </>)
    }
export default MatchPrimitives