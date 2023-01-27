import type { Accessor, Component } from "solid-js";
import { Match } from "solid-js";
import { Field,Color,Text,Number,Boolean, RepeatField, Label } from "./Input";

const MatchPrimitives: Component<{
    repeat: Accessor<boolean>;
    entry: [string, any];
    relay: (value:string | number | boolean) => void;
    relayRepeat: (value: number | boolean) => void;

}> = (props) => {

    return (<>
        <Match when={props.entry[0] === 'color'}>
            <Field>
                <Color initialValue={props.entry[1]} relay={(value) => props.relay(value)} />
            </Field>
        </Match>
        <Match when={typeof props.entry[1] === 'string'}>
            <Field>
                <Text initialValue={props.entry[1]} relay={(value) => props.relay(value)} />
            </Field>
        </Match>
        <Match when={typeof props.entry[1] === 'number'}>
            <RepeatField repeat={props.repeat}  input={<>
                <Number initialValue={0} relay={(value) => props.relayRepeat(value)} />
            </>}
            >
                <Number initialValue={props.entry[1]} relay={(value) => props.relay(value)} />
            </RepeatField>
        </Match>
        <Match when={typeof props.entry[1] === 'boolean'}>
            <Field>
                <Boolean initialValue={props.entry[1]} relay={(value) => props.relay(value)} />
            </Field>
        </Match>
    </>)
    }
export default MatchPrimitives