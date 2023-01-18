import type {  Component } from "solid-js";
import type { ClassKeys } from "../../objects";
import { Switch, Match, For, onMount, Show } from "solid-js";
import { Label } from "../input/Input";
import MatchPrimitives from "./form/Primitives";
import ObjectBuilder,{canRecurse} from "./ObjectBuilder";
import CreateObjectBtn from "../input/CreateObjectBtn";

export type Paths = { [key: string]: string[] }
export type UnknownObject = { [key: string]: unknown }

interface EditObjectHanderProps {
    type: ClassKeys;
    builder:ObjectBuilder
}

type EditObjectProps = EditObjectHanderProps & {
    config: UnknownObject;
    rootKey?: string;
    depth: number
}
type RecurseObjectProps = EditObjectHanderProps & EditObjectProps & {
    entry: [string, UnknownObject]
}

const EditObjectForm: Component<{
    type: ClassKeys;
    builder: ObjectBuilder
    config: UnknownObject;
}> = (props) => {

    return <form >
        <h2>EditObject</h2>
        <Entries
            depth={0}
            type={props.type}
            builder={props.builder}
            config={props.config}
        />
    </form>
    }

const FilterEntry: Component<{
    entry: [string, any]
    builder: ObjectBuilder;
    depth: number;
    type: ClassKeys
    rootKey?: string
    }> = (props) => {
        return (<>
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
                    rootKey={props.depth === 0 ? props.entry[0] : props.rootKey}
                />
            </Switch>
        </>)
    }


const Entries: Component<EditObjectProps> = (props) => {
    return <>
        <For each={Object.entries(props.config)}>{(entry) => (
            <FilterEntry
                entry={entry}
                type={props.type}
                depth={props.depth}
                builder={props.builder}
                rootKey={props.rootKey}
            />
        )}
        </For>
        <Show when={props.depth === 0}>
            <CreateObjectBtn type={props.type} builder={props.builder} />
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
        />
    </Match>
    }


export default EditObjectForm;