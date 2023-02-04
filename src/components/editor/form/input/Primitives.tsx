import { Component, Switch } from "solid-js";
import { Match } from "solid-js";
import { Color, Text, Number, Boolean } from "./Input";

const MatchPrimitives: Component<{
    relay: (key: string, value: string | number | boolean) => void;
    field: {
        path: string[],
        value: any
    }
}> = (props) => {
    const key = props.field.path[props.field.path.length - 1]

    return <Switch>
        <Match when={key === 'color'}>
            <Color initialValue={props.field.value} relay={(value) => props.relay(key, value)} />
        </Match>
        <Match when={typeof props.field.value === 'string'}>
            <Text initialValue={props.field.value} relay={(value) => props.relay(key, value)} />
        </Match>
        <Match when={typeof props.field.value === 'number'}>
            <Number initialValue={props.field.value} relay={(value) => props.relay(key, value)} />
        </Match>
        <Match when={typeof props.field.value === 'boolean'}>
            <Boolean initialValue={props.field.value} relay={(value) => props.relay(key, value)} />
        </Match>
    </Switch>
}
export default MatchPrimitives