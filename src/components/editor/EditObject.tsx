import type {  Component } from "solid-js";
import { Switch, Match, For, onMount, createSignal, createEffect } from "solid-js";
import { Label } from "../input/Input";
import MatchPrimitives from "./form/Primitives";
import { createStore, produce, SetStoreFunction, Store } from 'solid-js/store'
import CreateGameObjectBtn from "../input/CreateGameObjectBtn";
import {editProperty,setRootKeys,canRecurse} from './object-edit-util'

export type Indexable = {[key:string]:any}
export type Paths = { [key: string]: string[] }

interface EditObjectHanderProps {
    config?: Indexable;
    root: Indexable
    paths: Paths
    setPaths: SetStoreFunction<Paths>
}

type EditObjectProps = EditObjectHanderProps & {
    rootKey?: string;
    depth: number
}
type RecurseObjectProps = EditObjectHanderProps & EditObjectProps & {
    entry: [string, object]
}

const EditObjectForm: Component<{
    handleCreate: (config: Indexable) => void;
    root: Indexable;
    type: string;
}> = (props) => {
    let formRef: HTMLFormElement;
    const { root } = props;
    const [paths,setPaths] = createStore<Paths>({})
    onMount(() => {
        console.log('Mounted!');
        setRootKeys(root, setPaths)
        console.log(paths);
        
    })

    return <form ref={formRef!}>
        <h2>EditObject</h2>
        <FilterObject
                depth={0}
                root={root}
                paths={paths}
                setPaths={setPaths}
            />
        <CreateGameObjectBtn
                onCreate={() => props.handleCreate(root)}
                type={props.type}
            />
    </form>
    }



const FilterObject: Component<EditObjectProps> = (props) => {
    const { root } = props;
    
    return <For each={Object.entries(props.config ? props.config : props.root)}>{(entry => {
        // console.log('For entry: %s, rootKey: %s',entry[0],props.rootKey);

        return (<>
            <Label for={entry[0]} />
            <Switch>
                <MatchPrimitives relay={(value) => {
                    console.log('ROOTKEY',props.rootKey);
                    
                    !props.rootKey ?
                        root[entry[0]] = value() :
                        editProperty(props.paths[props.rootKey],root,props.rootKey,entry[0],value())
                    console.log('Root:',root);
                    
                }} entry={entry}
                />
            <Match when={canRecurse(entry[1])}>
                <Recurse
                    entry={entry}
                    config={entry[1]}
                    root={props.root}
                    depth={props.depth}
                    paths={props.paths}
                    setPaths={props.setPaths}
                    rootKey={props.depth === 0 ? entry[0] : props.rootKey}
                />
            </Match>
        </Switch>
        </>)
    })}
    </For>
}

const Recurse: Component<RecurseObjectProps> = (props) => {
    onMount(() => {
        console.log('RECURSE::',props.entry[0]);
        console.log('RECURSE ROOTKEY::',props.rootKey)
        if ((props.rootKey && props.entry[1]) && props.rootKey !== props.entry[0]) {
            props.setPaths(produce((paths => {
                paths[props.rootKey!].push(props.entry[0])
            }))) 
        }
        console.log(props.paths);
        
    })

    return <FilterObject
        config={props.entry[1]}
        root={props.root}
        depth={props.depth ? props.depth + 1 : 1}
        paths={props.paths}
        setPaths={props.setPaths}
        rootKey={props.rootKey}
/>
    }


export default EditObjectForm;