import type {  Component } from "solid-js";
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
    add: (type: ClassTypes) => void;
}

type TrackingProps = FormProps & {
    depth: number;
    rootKey?: string
}

type FilterEntriesProps = TrackingProps & {
    config: UnknownObject;
}

type FilterEntryProps = TrackingProps & {
    entry: [string, any]
}
type RecurseObjectProps = FilterEntriesProps & {
    entry: [string, UnknownObject]
}

const ObjectForm: Component<FormProps> = (props) => {
    return <form >
        <h2>EditObject</h2>
        <FilterEntries
            depth={0}
            type={props.type}
            builder={props.builder}
            config={props.builder.root}
            add={props.add}
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
                add={props.add}
            />
        )}
        </For>
        <Show when={props.depth === 0}>
            <CreateObjectBtn type={props.type} builder={props.builder} add={props.add} />
        </Show>
    </>
}

const FilterEntry: Component<FilterEntryProps> = (props) => {
    return (<>
        <Show when={props.entry[0] !== 'id'}>
            <Label for={props.entry[0]} />
            <Switch>
                <MatchPrimitives entry={props.entry} relay={(value) => {
                    props.builder.edit(props.entry[0],value(),props.rootKey,)
                    console.log('Root:',props.builder.root);
                    }}
                />
                <MatchObjectRecursive
                    entry={props.entry}
                    config={props.entry[1]}
                    type={props.type}
                    depth={props.depth}
                    builder={props.builder}
                    add={props.add}
                    rootKey={props.depth === 0 ? props.entry[0] : props.rootKey}
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
            add={props.add}
        />
    </Match>
}


export default ObjectForm;