import type {  Component } from 'solid-js'
import type { UnknownObject } from './EditObjectForm'
import { Show, For, Switch, Match, onMount } from 'solid-js'
import MatchPrimitives from './input/Primitives'
import ObjectBuilder, { canEdit, canRecurse } from '../ObjectBuilder'


type RecurseEntriesProps = {
    config: UnknownObject;
    builder:ObjectBuilder
    depth: number;
    rootKey?: string;
}

type MatchObjectProps = RecurseEntriesProps & {
    entry: [string, UnknownObject]
}

const RecurseEntries: Component<RecurseEntriesProps> = (props) => {
    return <div class='form-entries'>
        <For each={Object.entries(props.config)}>{(entry) => (
            <Show when={canEdit(entry[0])}>
                <div class='form-entry'>
                    <label>{entry[0]}</label>
                    <Switch>
                        <MatchPrimitives
                            entry={entry}
                            relay={(value) => props.builder.edit(entry[0], value, props.rootKey)}
                        />
                        <MatchObject
                            entry={entry as [string, UnknownObject]}
                            config={entry[1] as UnknownObject}
                            builder={props.builder}
                            rootKey={props.depth === 0 ? entry[0] : props.rootKey}
                            depth={props.depth}
                        />
                    </Switch>
                </div>
            </Show>
        )}
        </For>
    </div>
}
const MatchObject: Component<MatchObjectProps> = (props) => {
    onMount(() => {
        if (props.rootKey && props.rootKey !== props.entry[0] && canRecurse(props.entry[1])) {
            props.builder.addToPath(props.rootKey, props.entry)
            console.log(props.builder.paths);
        }
    })
    
    return <Match when={canRecurse(props.entry[1])}>
        <RecurseEntries
            rootKey={props.rootKey}
            builder={props.builder}
            config={props.entry[1]}
            depth={props.depth + 1}
        />
    </Match>
}

export default RecurseEntries;
