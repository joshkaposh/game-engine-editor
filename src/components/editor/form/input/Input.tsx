import type { Component, Signal } from "solid-js";
import { createSignal } from "solid-js";

type Relay<T extends unknown> = (value: T) => void;
type InputProps<T extends unknown> = {
    relay?: Relay<T>;
    signal?: Signal<T>;
    initialValue?: T;
    class?: string;
}

type TextProps = InputProps<string>;
type BooleanProps = InputProps<boolean>;
type RangeProps = InputProps<number> & {
    min: number;
    max: number;
}
type NumberProps = InputProps<number> & {
    min?: number;
    max?: number;
};


function inputSignal<T extends unknown>(initialValue: T, potentialSignal?: Signal<T>) {
    if (!potentialSignal)
        return createSignal(initialValue)
    return potentialSignal
}

export const Boolean: Component<BooleanProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? false, props.signal)
    return <input type="checkbox" checked={signal[0]()} onchange={(e) => {
        e.preventDefault();
        signal[1](!signal[0]())
        if (props.relay) {
            props.relay(signal[0]())
        }
    }} />
}

export const Number: Component<NumberProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? 0, props.signal)

    return <input type='number' min={props.min} max={props.max} class={props.class} value={signal[0]()} oninput={(e) => {
        e.preventDefault();
        e.currentTarget.value.charAt(0) !== '' ?
            signal[1](parseInt(e.currentTarget.value)) :
            signal[1](0)

        props.relay && props.relay(signal[0]())

    }} />
}

export const Text: Component<TextProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? '', props.signal)

    return <input type="text" value={props.initialValue} oninput={(e) => {
        e.preventDefault();
        signal[1](e.currentTarget.value)
        props.relay && props.relay(signal[0]())
    }} />
}

export const Color: Component<TextProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? '#fff', props.signal)

    return <input type="color" value={signal[0]()} oninput={(e) => {
        e.preventDefault();
        signal[1](e.currentTarget.value)
        props.relay && props.relay(signal[0]())
    }} />
}

export const Range: Component<RangeProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? 0, props.signal)

    return <>
        <input
            type='range'
            value={signal[0]()}
            onchange={(e) => {
                e.preventDefault();
                signal[1](parseInt(e.currentTarget.value))
                props.relay && props.relay(parseInt(e.currentTarget.value))
            }}
            min={Math.floor(props.min)}
            max={Math.floor(props.max)}
        />
    </>
}


export const Checkbox: Component<BooleanProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? false, props.signal)

    return <input type="checkbox" checked={signal[0]()} onchange={(e) => {
        e.preventDefault();
        signal[1](!signal[0]())
        props.relay && props.relay(signal[0]())
    }} />
}