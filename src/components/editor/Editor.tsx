import type {Component,Accessor, } from 'solid-js'
import type { ClassKeys, Configs } from '../../objects';
import { createSignal, Show, onMount } from "solid-js";
import ObjectBuilder from './ObjectBuilder';
import EditObjectForm from './EditObject';
import SelectObject from "./SelectObject";

const DisplayConfig: Component<{
    config: object;
}> = (props) => {
    return <p>Config: 
            {JSON.stringify(props.config)}
    </p>
}

const ConfigureObject: Component<{
    config: Configs;
    builder: ObjectBuilder;
    select: (type: ClassKeys) => void;
    selected:Accessor<ClassKeys | undefined>
}> = (props) => {
    // onMount(() => {
        // props.builder.setDefaultConfig(props.selected()!)
        // console.log('Mounted!');
    // })
    
    return <>
        <DisplayConfig config={props.config} />
        <SelectObject select={props.select} />
        <EditObjectForm
            type={props.selected()!}
            builder={props.builder}
            config={props.config}
        />
    </>
}

const Editor: Component = () => {
    const [selected, setSelected] = createSignal<ClassKeys>()
    const builder = new ObjectBuilder();

    const selectObject = (type: ClassKeys) => {
        builder.switchObjectConfig(type)

        if (type === selected()) {
            setSelected(undefined);
            return;
        }
        setSelected(type)
        return;
    }
    // TODO: figure out strategy to rerender when root changes
    return <div class='editor'>
        <h2>Selected: {selected()}</h2>
        <Show when={selected()} fallback={<SelectObject select={selectObject} />}>
            {() => <ConfigureObject
                builder={builder}
                config={builder.root}
                select={selectObject}
                selected={selected}
            
            />}
        </Show>
    </div>
}

export default Editor;