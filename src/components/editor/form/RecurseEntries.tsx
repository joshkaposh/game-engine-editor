import type { Accessor, Component } from 'solid-js'
import type { UnknownObject } from './EditObjectForm'
import { Show, For, Switch, Match, onMount } from 'solid-js'
import { Label } from './input/Input'
import MatchPrimitives from './input/Primitives'
import ObjectBuilder, { canEdit, canRecurse } from '../ObjectBuilder'


type FilterEntriesProps = {
    config: UnknownObject;
    builder:ObjectBuilder
    depth: number;
    repeat: Accessor<boolean>;
    rootKey?: string;
}

type MatchObjectProps = FilterEntriesProps & {
    entry: [string, UnknownObject]
}

const RecurseEntries: Component<FilterEntriesProps> = (props) => {
    return <>
        <For each={Object.entries(props.config)}>{(entry) => (
            <Show when={canEdit(entry[0])}>
                <Label for={entry[0]} />
                <Switch>
                    <MatchPrimitives
                        repeat={props.repeat}
                        entry={entry}
                        relay={(value) => props.builder.edit(entry[0], value, props.rootKey)}
                        relayRepeat={(value) =>{}}
                    />
                    <MatchObject
                        entry={entry as [string, UnknownObject]}
                        config={entry[1] as UnknownObject}
                        builder={props.builder}
                        rootKey={props.depth === 0 ? entry[0] : props.rootKey}
                        depth={props.depth}
                        repeat={props.repeat}
                    />
                </Switch>
            </Show>
        )}
        </For>
    </>
}
const MatchObject: Component<MatchObjectProps> = (props) => {
    onMount(() => {
        if (props.rootKey && props.entry[1] && props.rootKey !== props.entry[0] && canRecurse(props.entry[1])) {
            props.builder.addToPath(props.rootKey,props.entry[0])
        }
    })
    
    return <Match when={canRecurse(props.entry[1])}>
        <RecurseEntries
            repeat={props.repeat}
            rootKey={props.rootKey}
            builder={props.builder}
            config={props.entry[1]}
            depth={props.depth + 1}
        />
    </Match>
}

export default RecurseEntries;
