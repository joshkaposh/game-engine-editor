import  { children, Component, JSXElement } from "solid-js";
import type { ClassKeys, ClassTypes } from "../../../objects";
import { Switch, Match, For, onMount, Show, createSignal } from "solid-js";
import { Label } from "./input/Input";
import MatchPrimitives from "./input/Primitives";
import CreateObjectBtn from "./input/CreateObjectBtn";
import ObjectBuilder, { canEdit, canRecurse } from "../ObjectBuilder";

export type Paths = { [key: string]: string[] }
export type UnknownObject = { [key: string]: unknown }

export interface FormProps {
    type: ClassKeys;
    builder: ObjectBuilder
    create: (type: ClassTypes) => void;
}

type FilterEntriesProps = FormProps & {
    config: UnknownObject;
} & {
    depth: number;
    rootKey?: string
}

type RecurseObjectProps = FilterEntriesProps & {
    entry: [string, UnknownObject]
}


const EditObjectForm: Component<FormProps> = (props) => {
    return <form >
        <div>
            <h2>{props.type}</h2>
        </div>
        <EntriesOld
            type={props.type}
            builder={props.builder}
            create={props.create}
            depth={0}
            config={props.builder.root}
        />
    </form>
}

// TODO: refactor Switch to into <SwitchTypes primitives={<Primitives />} objects={<Objects />} /> 

const Filter: Component<{
    entry:[string,unknown]
    primitives: JSXElement;
    objects: JSXElement;
}> = (props) => {
    const p = children(() => props.primitives)
    const o = children(() => props.objects)
    return <>
        <Label entry={props.entry} handleClick={(type) => {}} />
        <Switch>
            {p}
            {o}
        </Switch>
    </>
}

const EntriesOld: Component<FilterEntriesProps> = (props) => {
    return <>
        <For each={Object.entries(props.config)}>{(entry) => (
            <Show when={canEdit(entry[0])}>
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
const EntriesNew: Component<FilterEntriesProps> = (props) => {
    return <>
        <For each={Object.entries(props.config)}>{(entry) => (
            <Show when={entry[0] !== 'id' && entry[0] !== 'goName'}>
                <Filter
                    entry={entry}
                    primitives={
                        <MatchPrimitives
                        entry={entry}
                        relay={(value) => props.builder.edit(entry[0], value(), props.rootKey)}
                        />
                    }
                    objects={<MatchObjectRecursive
                        entry={entry as [string, UnknownObject]}
                        config={entry[1] as UnknownObject}
                        type={props.type}
                        depth={props.depth}
                        builder={props.builder}
                        rootKey={props.depth === 0 ? entry[0] : props.rootKey}
                        create={props.create}
                    />}

                />
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
        <EntriesOld
            config={props.entry[1]}
            depth={props.depth + 1}
            type={props.type}
            builder={props.builder}
            rootKey={props.rootKey}
            create={props.create}
        />
    </Match>
}


export default EditObjectForm;