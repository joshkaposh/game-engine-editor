import {Component,Accessor, Setter, createEffect, } from 'solid-js'
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
    builder: ObjectBuilder;
    select: (type: ClassKeys) => void;
    selected: Accessor<ClassKeys | undefined>
}> = (props) => {
    
    return <>
        <DisplayConfig config={props.builder!.root} />
        <SelectObject select={props.select} />
        <EditObjectForm
            type={props.selected()!}
            builder={props.builder!}
        />
    </>
    }

const createSignals = () => {
    const [selected, setSelected] = createSignal<ClassKeys>()
    const [builder,setBuilder] = createSignal<ObjectBuilder>()
    const select = (type: ClassKeys) => {
        if (type === selected()) {
            setSelected(undefined);
            return;
        }
        setSelected(type)
        return;
    }

    createEffect(() => {
        if (!selected()) {
            setBuilder();
            return
        }
        setBuilder(new ObjectBuilder(selected()!));
        return
    })

    return {
        builder,
        selected,
        select,
    }

}

const Editor: Component = () => {
    const {selected,builder,select} = createSignals()

    return <div class='editor'>
        <h2>Selected: {selected()}</h2>
        <Show when={selected() && builder()} fallback={<SelectObject select={select} />}>
            <ConfigureObject
                builder={builder()!}
                select={select}
                selected={selected}
            />
        </Show>
    </div>
}

export default Editor;