import type {Component,Accessor, } from 'solid-js'
import type { ClassKeys,Configs } from '../../objects';

import { createSignal,createEffect, Show, For, Switch, Match, onMount } from "solid-js";
import { createStore } from 'solid-js/store';
import objects, { EditorKeys, editors } from "../../objects";
import { ObjectBuilder } from './object-edit-util';
import SelectObject from "./SelectObject";
import EditObjectForm, { Paths } from './EditObject';
import { setRootKeys } from './object-edit-util';
const DisplayConfig: Component<{
    config: object;
}> = (props) => {
    return <p>Config: 
            {JSON.stringify(props.config)}
    </p>
}

let currentConfig: Configs | undefined;
const ConfigureObject: Component<{
    config: Configs;
    builder: ObjectBuilder;
    select: (type: ClassKeys) => void;
    selected:Accessor<ClassKeys | undefined>
}> = (props) => {
    // const [paths,setPaths] = createStore<Paths>({})
    onMount(() => {
        props.builder.setDefaultConfig(props.selected()!,props.config)
        console.log('Mounted!');
        // setRootKeys(props.config, setPaths)
        // console.log(paths);
    })
    
    return <>
        <DisplayConfig config={props.config} />
        <SelectObject objects={objects} select={props.select} />
        <EditObjectForm
            type={props.selected()!}
            root={props.config}
            builder={props.builder}
            // paths={paths}
            // setPaths={setPaths}
        />
    </>
}

const Editor: Component = () => {
    const [selected, setSelected] = createSignal<ClassKeys>()
    const builder = new ObjectBuilder();

    // todo: create a Component <Name name={name} onSelect={name => {}} />
    
    
    const selectObject = (type: ClassKeys) => {
        builder.switchObjectConfig(type)

        if (type === selected()) {
            setSelected(undefined);
            return;
        }
        setSelected(type)
        return;
    }
    const getConfig = (type:ReturnType<typeof selected>) => {
        if (typeof type === 'string') {
            console.log('Getting config of type %s',type);
            
            return editors[type].config()
        }
    }
    const config = () => getConfig(selected()) as Configs

    return <div class='editor'>
        <h2>Selected: {selected()}</h2>
        <Show when={selected()} fallback={<SelectObject objects={objects} select={selectObject} />}>
            <ConfigureObject
                builder={builder}
                config={config()}
                select={selectObject}
                selected={selected}
            />
            
        </Show>
    </div>
}

export default Editor;