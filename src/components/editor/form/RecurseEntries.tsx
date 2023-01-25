import type {Component, Accessor, Setter} from 'solid-js'
import type { Modes, UnknownObject } from './EditObjectForm'
import { Show, For, Switch, Match, onMount } from 'solid-js'
import { Label } from './input/Input'
import MatchPrimitives from './input/Primitives'
import ObjectBuilder, { canEdit, canRecurse } from '../ObjectBuilder'


type FilterEntriesProps = {
    mode: Accessor<Modes>
    setMode: Setter<Modes>
    config: UnknownObject;
    builder:ObjectBuilder
    depth: number;
    rootKey?: string;
}

type MatchObjectProps = FilterEntriesProps & {
    entry: [string, UnknownObject]
}

const RecurseEntries: Component<FilterEntriesProps> = (props) => {
    return <>
        <For each={Object.entries(props.config)}>{(entry) => (
            <Show when={canEdit(entry[0])}>
                <Label for={entry[0]} handleClick={(type) => {}} />
                <Switch>
                    <MatchPrimitives
                        entry={entry}
                        relay={(value) => props.builder.edit(entry[0], value(), props.rootKey)}
                    />
                    <MatchObject
                        entry={entry as [string, UnknownObject]}
                        config={entry[1] as UnknownObject}
                        depth={props.depth}
                        rootKey={props.depth === 0 ? entry[0] : props.rootKey}
                        builder={props.builder}
                        mode={props.mode}
                        setMode={props.setMode}
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
            rootKey={props.rootKey}
            config={props.entry[1]}
            depth={props.depth + 1}
            builder={props.builder}
            mode={props.mode}
            setMode={props.setMode}
        />
    </Match>
}

export default RecurseEntries;
