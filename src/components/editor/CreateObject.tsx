import type {Component,Accessor} from 'solid-js'
import {Match,Switch, For} from 'solid-js'
import {Text,Number,Boolean} from '../input/Input'

// const 

const Primitives: Component<{
    entry: [string, any]
    relay: (value: Accessor<string | number | boolean>) => void;
}> = (props) => {
    return (
        <>
        <Match when={typeof props.entry[1] === 'string'}>
            <Text relay={props.relay} />
        </Match>
        <Match when={typeof props.entry[1] === 'number'}>
            <Number relay={props.relay} />
        </Match>
        <Match when={typeof props.entry[1] === 'boolean'}>
            <Boolean relay={props.relay} />
        </Match>
        </>
        )    
}

const EditObject: Component<{
    config: () => ({[key:string]:any});
}> = (props) => {
    console.log(props.config());
    
    return <form>
        <h2>EditObject</h2>
        <For each={Object.entries(props.config())}>{(entry => {
            return <Switch>
                <Primitives relay={(value) => console.log(value())} entry={entry} />
            </Switch>
        })}</For>
    </form>
}
