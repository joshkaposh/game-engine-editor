import {  Accessor, Component, createEffect, createSignal, Setter } from "solid-js";
import type { ClassKeys, ClassTypes } from "../../objects";
import { Switch, Match, For, onMount, Show } from "solid-js";
import { Label } from "../input/Input";
import MatchPrimitives from "./form/Primitives";
import ObjectBuilder,{canRecurse} from "./ObjectBuilder";
import CreateObjectBtn from "../input/CreateObjectBtn";

export type Paths = { [key: string]: string[] }
export type UnknownObject = { [key: string]: unknown }

export interface FormProps {
    type: ClassKeys;
    builder: ObjectBuilder
    create: (type: ClassTypes) => void;
}

type TrackingProps = FormProps & {
    depth: number;
    rootKey?: string
}

type FilterEntriesProps = TrackingProps & {
    config: UnknownObject;
    repeatProperty: Accessor<string | undefined>
    setRepeatProperty:Setter<string | undefined>
    
}

type FilterEntryProps = TrackingProps & {
    repeatProperty: Accessor<string | undefined>
    setRepeatProperty:Setter<string | undefined>
    entry: [string, any]
}
type RecurseObjectProps = FilterEntriesProps & {
    entry: [string, UnknownObject]
}

const Repeat: Component<{
    type: string;
    property: Accessor<string | undefined>;
}> = (props) => {
    const [toggled,setToggled] = createSignal(false)
    // TODO: provide a menu for repeated object creation E.g current.x = last.x + someValue
    // TODO: provide an operator (-, +, *, /)
    // TODO: refactor FilterEntries to take isRepeating prop

    
    return <>
        <button type='button' onclick={(e) => {
            e.preventDefault();
            setToggled(!toggled())
        }}>
        Repeat
        </button>
        <Show when={toggled()}>
            <div>
                <p>Hi {props.property()}</p>
                
            </div>
        </Show>
    </>
}

const ObjectForm: Component<FormProps> = (props) => {
    const [property,setProperty] = createSignal<string>()

    return <form >
        <div>
            <h2>{props.type}</h2>
            {/* <Repeat property={property} type={props.type} /> */}
        </div>
        
        <FilterEntries
            depth={0}
            type={props.type}
            builder={props.builder}
            config={props.builder.root}
            create={props.create}
            repeatProperty={property}
            setRepeatProperty={setProperty}
        />
    </form>
}

const FilterEntries: Component<FilterEntriesProps> = (props) => {
    return <>
        <For each={Object.entries(props.config)}>{(entry) => (
            <FilterEntry
                entry={entry}
                type={props.type}
                depth={props.depth}
                builder={props.builder}
                rootKey={props.rootKey}
                create={props.create}
                repeatProperty={props.repeatProperty}
                setRepeatProperty={props.setRepeatProperty}
            />
        )}
        </For>
        <Show when={props.depth === 0}>
            <CreateObjectBtn type={props.type} builder={props.builder} create={props.create} />
        </Show>
    </>
}

const FilterEntry: Component<FilterEntryProps> = (props) => {
    return (<>
        <Show when={props.entry[0] !== 'id' && props.entry[0] !== 'goName'}>
            <Label entry={props.entry} handleClick={(type) => {
                props.setRepeatProperty(type)
            }} />
            <Switch>
                <MatchPrimitives entry={props.entry} relay={(value) => {
                    props.builder.edit(props.entry[0],value(),props.rootKey,)
                    }}
                />
                <MatchObjectRecursive
                    entry={props.entry}
                    config={props.entry[1]}
                    type={props.type}
                    depth={props.depth}
                    builder={props.builder}
                    rootKey={props.depth === 0 ? props.entry[0] : props.rootKey}
                    create={props.create}
                    repeatProperty={props.repeatProperty}
                    setRepeatProperty={props.setRepeatProperty}
                />
            </Switch>
        </Show>
        </>)
}

const MatchObjectRecursive: Component<RecurseObjectProps> = (props) => {
    onMount(() => {
        if (props.rootKey && props.entry[1] && props.rootKey !== props.entry[0] && canRecurse(props.entry[1])) {
            props.builder.addToPath(props.rootKey,props.entry[0])
        }
    })

    return <Match when={canRecurse(props.entry[1])}>
        <FilterEntries
            config={props.entry[1]}
            depth={props.depth + 1}
            type={props.type}
            builder={props.builder}
            rootKey={props.rootKey}
            create={props.create}
            repeatProperty={props.repeatProperty}
            setRepeatProperty={props.setRepeatProperty}
        />
    </Match>
}


export default ObjectForm;