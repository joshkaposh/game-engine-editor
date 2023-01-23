import type { Component, Accessor } from "solid-js";
import { createSignal } from "solid-js";

type Relay<T extends unknown> = (value: Accessor<T>) => void;
type Input<T extends unknown> = {
    relay: Relay<T>;
    initialValue?: T;
}

type NumberProps = Input<number>;
type TextProps = Input<string>;
type BooleanProps = Input<boolean>;

export const Label: Component<{
    entry:[string,unknown]
    handleClick: (type: string) => void;
}> = (props) => {
    return <label onclick={(e) => {
        e.preventDefault();
        props.handleClick(props.entry[0])
    }}>{props.entry[0]}</label>
}

export const Boolean: Component<BooleanProps> = (props) => {
    const [value, setValue] = createSignal(props.initialValue ?? false)

    return <input type="checkbox" checked={props.initialValue} onchange={(e) => {
        e.preventDefault();
        setValue(!value());
        props.relay(value)
    }} />
}

export const Number: Component<NumberProps> = (props) => {
    const [value,setValue] = createSignal(props.initialValue ?? 0)

    return <input type='number' value={props.initialValue} oninput={(e) => {
        e.preventDefault();
        setValue(parseInt(e.currentTarget.value))
        props.relay(value)
    }} />
}


export const Color: Component<TextProps> = (props) => {
    const [value,setValue] = createSignal(props.initialValue ?? '#000')
    return <input type="color" value={props.initialValue} oninput={(e) => {
        e.preventDefault();
        setValue(e.currentTarget.value)
        props.relay(value)
    }} />
}

export const Text: Component<TextProps> = (props) => {
    const [value,setValue] = createSignal(props.initialValue ?? '')
    return <input type="text" value={props.initialValue} oninput={(e) => {
        e.preventDefault();
        setValue(e.currentTarget.value)
        props.relay(value)
    }} />
}