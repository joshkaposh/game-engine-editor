import { Component, Accessor, JSXElement, Setter } from "solid-js";
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
    for:string
    handleClick: (type: string) => void;
}> = (props) => {
    return <label onclick={(e) => {
        e.preventDefault();
        props.handleClick(props.for)
    }}>{props.for}</label>
    }

export const Field: Component<{
        input:JSXElement
}> = (props) => {
        return <>
            {props.input}
            <br />
        </>
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

export const Text: Component<TextProps> = (props) => {
    const [value,setValue] = createSignal(props.initialValue ?? '')
    return <input type="text" value={props.initialValue} oninput={(e) => {
        e.preventDefault();
        setValue(e.currentTarget.value)
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

export const SelectRange: Component<{
    min:number
    max: number
    index: Accessor<number | undefined>;
    setIndex: Setter<number | undefined>;
    closeMenu: () => void;
}> = (props) => {
    const [value, setValue] = createSignal(0);
    
    return <>
        <input
        type='range'
        value={props.min}
        onchange={(e) => {
            e.preventDefault();
            setValue(parseInt(e.currentTarget.value))
        }}
        min={Math.floor(props.min)}
        max={Math.floor(props.max)}
        />
        <button type='button' onclick={e => {
            e.preventDefault();
            console.log('ONCLICK::',value());
            
            props.setIndex(value())
            props.closeMenu();
        }}>Select</button>
        
    </>
}