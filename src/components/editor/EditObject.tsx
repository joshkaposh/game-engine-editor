import type {  Component } from "solid-js";
import type { ClassKeys, Configs } from "../../objects";
import { Switch, Match, For, onMount, createSignal, createEffect } from "solid-js";
import { Label } from "../input/Input";
import MatchPrimitives from "./form/Primitives";
import { createStore, produce, SetStoreFunction, Store } from 'solid-js/store'
import CreateGameObjectBtn from "../input/CreateGameObjectBtn";
import {setRootKeys,canRecurse, ObjectBuilder} from './object-edit-util'
import { editors } from "../../objects";

export type Indexable = {[key:string]:any}
export type Paths = { [key: string]: string[] }

interface EditObjectHanderProps {
    config?: Indexable;
    root: Indexable
    type: ClassKeys;
    builder:ObjectBuilder
    // paths: Paths
    // setPaths: SetStoreFunction<Paths>
}

type EditObjectProps = EditObjectHanderProps & {
    rootKey?: string;
    depth: number
}
type RecurseObjectProps = EditObjectHanderProps & EditObjectProps & {
    entry: [string, object]
}

const EditObjectForm: Component<{
    root: Configs;
    type: ClassKeys;
    builder:ObjectBuilder
}> = (props) => {
    let formRef: HTMLFormElement;
    

    return <form ref={formRef!}>
        <h2>EditObject</h2>
        <FilterObject
            depth={0}
            root={props.root}
            type={props.type}
            builder={props.builder}
            // paths={props.paths}
            // setPaths={props.setPaths}
        />
    </form>
    }



const FilterObject: Component<EditObjectProps> = (props) => {
    const { root } = props;
    
    return <><For each={Object.entries(props.config ? props.config : props.root)}>{(entry => {
        // console.log('For entry: %s, rootKey: %s',entry[0],props.rootKey);

        return (<>
            <Label for={entry[0]} />
            <Switch>
                <MatchPrimitives relay={(value) => {
                    console.log('ROOTKEY',props.rootKey);
                    // props.builder.editProperty()
                    // root[entry[0]] = value()
                    !props.rootKey ?
                        props.builder.editProperty(entry[0],value()):
                        props.builder.editPropertyPath(props.rootKey,entry[0],value())
                    console.log('Root:',props.builder.root);
                    
                }} entry={entry}
                />
            <Match when={canRecurse(entry[1])}>
                <Recurse
                    entry={entry}
                    config={entry[1]}
                    root={props.root}
                    type={props.type}
                    depth={props.depth}
                    builder={props.builder}
                    rootKey={props.depth === 0 ? entry[0] : props.rootKey}
                />
            </Match>
            </Switch>
            
        </>)
    })}
    </For>
    {props.depth === 0 && 
        <CreateGameObjectBtn
            onCreate={() => {
                console.log('CREATE::',props.type,props.builder.root);
                console.log(editors[`${props.type as string}`].create(props.builder.root as any))
        }}
        type={props.type}
        config={props.root}
        />
    }
    </>
    
}

const Recurse: Component<RecurseObjectProps> = (props) => {
    const { root } = props;
    
    onMount(() => {
        console.log('RECURESE::depth',props.depth);
        
        // console.log('RECURSE::',props.entry[0]);
        // console.log('RECURSE ROOTKEY::',props.rootKey)
        if ((props.rootKey && props.entry[1]) && props.rootKey !== props.entry[0]) {
            props.builder.addToPath(props.rootKey,props.entry[0])

        }
        
    })

    return <FilterObject
        config={props.entry[1]}
        root={root}
        depth={props.depth + 1}
        type={props.type}
        builder={props.builder}
        // paths={props.paths}
        // setPaths={props.setPaths}
        rootKey={props.rootKey}
/>
    }


export default EditObjectForm;