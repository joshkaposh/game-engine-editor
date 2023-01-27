import type { ParentComponent,Component, Accessor, JSXElement, Setter , ChildrenReturn, Signal } from "solid-js";
import { createSignal,children,Show } from "solid-js";

type Relay<T extends unknown> = (value: T) => void;
type InputProps<T extends unknown> = {
    relay?: Relay<T>;
    signal?: Signal<T>;
    initialValue?: T;
    class?: string;
}

type NumberProps = InputProps<number>;
type TextProps = InputProps<string>;
type BooleanProps = InputProps<boolean>;
type RangeProps = InputProps<number> & {
    min: number;
    max: number;
}

function inputSignal<T extends unknown>(initialValue:T,potentialSignal?:Signal<T>) {
    if (!potentialSignal) 
        return createSignal(initialValue)
    return potentialSignal
}

export const Label: Component<{
    for:string
}> = (props) => <label>{props.for}</label>

export const RepeatField: ParentComponent<{
    repeat: Accessor<boolean>;
    input:JSXElement
}> = (props) => {
    const c = children(() => props.children)
    const r = children(() => props.input)
    return <>
        {c}
        <Show when={props.repeat()}>
            {r}
        </Show>
        <br />

    </>
}

export const Field: ParentComponent = (props) => {
    const c = children(() => props.children)
    return <>
        {c}
        <br />
    </>
}


export const Boolean: Component<BooleanProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? false,props.signal)


    return <input type="checkbox" checked={signal[0]()} onchange={(e) => {
        e.preventDefault();
        signal[1](!signal[0]())
        if (props.relay) {
            props.relay(signal[0]())
        }
    }} />
}

export const Number: Component<NumberProps & {
    min?: number;
    max?: number;
}> = (props) => {
    
    const signal = inputSignal(props.initialValue ?? 0,props.signal)

    return <input type='number' min={props.min} max={props.max} class={props.class} value={signal[0]()} oninput={(e) => {
        e.preventDefault();
        signal[1](parseInt(e.currentTarget.value))
        props.relay && props.relay(signal[0]())
    }} />
}

export const Text: Component<TextProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? '',props.signal)

    return <input type="text" value={props.initialValue} oninput={(e) => {
        e.preventDefault();
        signal[1](e.currentTarget.value)
        props.relay && props.relay(signal[0]())
    }} />
}

export const Color: Component<TextProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? '#000',props.signal)
    return <input type="color" value={props.initialValue} oninput={(e) => {
        e.preventDefault();
        signal[1](e.currentTarget.value)
        props.relay && props.relay(signal[0]())
    }} />
}

export const Button: Component<{
    handleClick: (e: MouseEvent & {
        currentTarget: HTMLButtonElement;
        target: Element;
    }) => void;
    type?: 'button' | 'submit' | 'reset';
    children?: JSXElement;
    class?: string;

}> = (props) => {
    const c = children(() => props.children)
    return <button type={props.type} class={props.class} onclick={props.handleClick}>{c}</button>
}


export const Range: Component<RangeProps> = (props) => {
    const signal = inputSignal(props.initialValue ?? 0,props.signal)

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