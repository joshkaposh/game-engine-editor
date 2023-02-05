import { Component, Index } from "solid-js";
import type { Field } from "../../ObjectBuilder";
import { Switch } from "solid-js";
import { Match } from "solid-js";
import { Color, Text, Number, Boolean } from "./Input";

type AcceptedValues = string | number | boolean

const Primitives: Component<{
    key: string;
    initialValue: unknown
    relay: (key: string, value: AcceptedValues) => void;
}> = (props) => {
    const { key } = props
    return <div>
        <label>{key}</label>
        <Switch>
            <Match when={key === 'color'}>
                <Color initialValue={props.initialValue as string} relay={(value) => props.relay(key, value)} />
            </Match>
            <Match when={typeof props.initialValue === 'string'}>
                <Text initialValue={props.initialValue as string} relay={(value) => props.relay(key, value)} />
            </Match>
            <Match when={typeof props.initialValue === 'number'}>
                <Number initialValue={props.initialValue as number} relay={(value) => props.relay(key, value)} />
            </Match>
            <Match when={typeof props.initialValue === 'boolean'}>
                <Boolean initialValue={props.initialValue as boolean} relay={(value) => props.relay(key, value)} />
            </Match>
        </Switch>
    </div>
}

const MatchPrimitives: Component<{
    relay: (key: string, value: AcceptedValues) => void;
    field: ([string, string, unknown] | [string, string[], unknown[]])
}> = (props) => {
    if (!Array.isArray(props.field[1]) && !Array.isArray(props.field[2])) {
        const key = props.field[1]
        return <Primitives
            key={key}
            initialValue={props.field[2]}
            relay={props.relay}
        />
    } else {
        const keys = props.field[1]
        const values = props.field[2]
        return <>
            <label>{props.field[0]}</label>
            <Index each={values as unknown[]}>{(item, i) => {
                return <Primitives
                    initialValue={item()}
                    key={keys[i]}
                    relay={props.relay}
                />
            }}</Index>
        </>
    }

}
export default MatchPrimitives