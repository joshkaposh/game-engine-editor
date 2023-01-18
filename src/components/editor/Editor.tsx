import type { Component } from 'solid-js'
import type { ClassKeys } from '../../objects';
import { createSignal, Show, createEffect } from "solid-js";
import SelectObject from "./SelectObject";
import ConfigureObject from './ConfigureObject';
import ObjectBuilder from './ObjectBuilder';

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