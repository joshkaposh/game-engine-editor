import type { Accessor, Component, Setter  } from 'solid-js'
import type { ClassKeys } from '../../objects';
import { createSignal, Show, createEffect } from "solid-js";
import SelectObject from "./SelectObject";
import ConfigureObject from './ConfigureObject';
import Canvas from '../canvas/Canvas';
import GameEngine from '../../game-engine/initialize';
import ObjectBuilder from './ObjectBuilder';
import objects from '../../objects';

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
        setBuilder,
        selected,
        select,
    }

}

const Play: Component<{
    isRunning: Accessor<boolean>
    setRunning: Setter<boolean>;
}> = (props) => {
    return <button type='button' onclick={(e) => {
        e.preventDefault();
        props.setRunning(!props.isRunning());
    }}>
        {props.isRunning() ? 'Stop':'Start'}
    </button>
}

const Editor: Component<{
    engine: GameEngine
}> = (props) => {
    const { selected, builder, select,setBuilder } = createSignals()
    const [isRunning,setRunning] = createSignal(false)

    createEffect(() => {
        isRunning() ?
            props.engine.start() :
            props.engine.stop();
    })
    
    return <div id='editor'>
        <div class='left'>
            <Play isRunning={isRunning} setRunning={setRunning} />            
            <h2>Selected: {selected()}</h2>
            <SelectObject types={Object.keys(objects)} select={select} engine={props.engine} />
            <Show when={selected() && builder()}>
                <ConfigureObject
                    builder={builder()!}
                    select={select}
                    selected={selected}
                    create={(type) => {
                        props.engine.add(type)
                        setBuilder(new ObjectBuilder(type.goName as ClassKeys))
                    }}
                />
            </Show>
        </div>
        <Canvas engine={props.engine} />
        <span class='right' />
        </div>
}

export default Editor;