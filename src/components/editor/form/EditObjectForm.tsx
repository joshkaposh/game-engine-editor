import type  {  Accessor, Component, Setter } from "solid-js";
import type { ClassKeys, ClassTypes } from "../../../objects";
import { Switch, Match, For, onMount, Show, createSignal } from "solid-js";
import { Label } from "./input/Input";
import MatchPrimitives from "./input/Primitives";
import CreateObjectBtn from "./input/CreateObjectBtn";
import ObjectBuilder, { canRecurse } from "../ObjectBuilder";


export type Paths = { [key: string]: string[] }
export type UnknownObject = { [key: string]: unknown }

export interface FormProps {
    type: ClassKeys;
    builder: ObjectBuilder
    create: (type: ClassTypes) => void;
}

type RecurseObjectProps = FilterEntriesProps & {
    entry: [string, UnknownObject]
}

type FilterEntryProps = FormProps & {
    repeatProperty: Accessor<string | undefined>
    setRepeatProperty:Setter<string | undefined>
    entry: [string, any]
} & {
    depth: number;
    rootKey?: string
}
type FilterEntriesProps = FormProps & {
    config: UnknownObject;
    repeatProperty: Accessor<string | undefined>
    setRepeatProperty:Setter<string | undefined>
} & {
        depth: number;
        rootKey?: string
}

const EditObjectForm: Component<FormProps> = (props) => {
    const [property,setProperty] = createSignal<string>()
    return <form >
        <div>
            <h2>{props.type}</h2>
        </div>
        <Entries
            type={props.type}
            builder={props.builder}
            create={props.create}
            depth={0}
            config={props.builder.root}
            repeatProperty={property}
            setRepeatProperty={setProperty}
        />
    </form>
}

const Entries: Component<FilterEntriesProps> = (props) => {
    return <>
        <For each={Object.entries(props.config)}>{(entry) => (
            <Show when={entry[0] !== 'id' && entry[0] !== 'goName'}>
                <Label entry={entry} handleClick={(type) => {}} />
                <Switch>
                    <MatchPrimitives
                        entry={entry}
                        relay={(value) => props.builder.edit(entry[0], value(), props.rootKey)}
                    />
                    <MatchObjectRecursive
                        entry={entry as [string, UnknownObject]}
                        config={entry[1] as UnknownObject}
                        type={props.type}
                        depth={props.depth}
                        builder={props.builder}
                        rootKey={props.depth === 0 ? entry[0] : props.rootKey}
                        create={props.create}
                        repeatProperty={props.repeatProperty}
                        setRepeatProperty={props.setRepeatProperty}
                    />
                </Switch>
            </Show>
        )}
        </For>
        <Show when={props.depth === 0}>
            <CreateObjectBtn type={props.type} builder={props.builder} create={props.create} />
        </Show>
    </>
}

const MatchObjectRecursive: Component<RecurseObjectProps> = (props) => {
    onMount(() => {
        if (props.rootKey && props.entry[1] && props.rootKey !== props.entry[0] && canRecurse(props.entry[1])) {
            props.builder.addToPath(props.rootKey,props.entry[0])
        }
    })

    return <Match when={canRecurse(props.entry[1])}>
        <Entries
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


export default EditObjectForm;