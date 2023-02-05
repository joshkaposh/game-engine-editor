import type { Component } from "solid-js";
import { Switch } from "solid-js";
import { Match } from "solid-js";
import { Color, Text, Number, Boolean } from "./Input";

const Primitives: Component<{
    relay: <T>(key: string, value: T) => void;
    key: string;
    initialValue: any
}> = (props) => {
    const { key } = props
    return <div>
        <label>{key}</label>
        <Switch>
            <Match when={key === 'color'}>
                <Color initialValue={props.initialValue} relay={(value) => props.relay(key, value)} />
            </Match>
            <Match when={typeof props.initialValue === 'string'}>
                <Text initialValue={props.initialValue} relay={(value) => props.relay(key, value)} />
            </Match>
            <Match when={typeof props.initialValue === 'number'}>
                <Number initialValue={props.initialValue} relay={(value) => props.relay(key, value)} />
            </Match>
            <Match when={typeof props.initialValue === 'boolean'}>
                <Boolean initialValue={props.initialValue} relay={(value) => props.relay(key, value)} />
            </Match>
        </Switch>
    </div>
}

export default Primitives