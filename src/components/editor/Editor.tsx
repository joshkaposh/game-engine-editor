import type { Accessor, Component, JSXElement,  } from 'solid-js'
import type { ClassKeys } from '../../objects';
import { createSignal, Show, createEffect,Switch, Match } from "solid-js";
import SelectObject from "./SelectObject";
import ConfigureObject from './ConfigureObject';
import Canvas from '../canvas/Canvas';
import GameEngine from '../../game-engine/initialize';
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

const Play: Component<{
    isRunning: Accessor<boolean>
    toggle: () => void;
}> = (props) => {
    return <button type='button' onclick={(e) => {
        e.preventDefault();
        props.toggle();
    }}>
        {props.isRunning() ? 'Stop':'Start'}
    </button>
}

const Editor: Component<{
    engine: GameEngine
}> = (props) => {
    const { selected, builder, select } = createSignals()
    const [isRunning,setRunning] = createSignal(false)
    const toggle = () => {
        setRunning(!isRunning());
    }

    createEffect(() => {
        isRunning() ?
            props.engine.start() :
            props.engine.stop();
    })
    
    return <div id='editor'>
        <div class='left'>
        <Play isRunning={isRunning} toggle={toggle} />            
        <h2>Selected: {selected()}</h2>
        <Show when={selected() && builder()} fallback={<SelectObject select={select} />}>
            <ConfigureObject
                builder={builder()!}
                select={select}
                selected={selected}
                add={(type) => props.engine.add(type)}
            />
        </Show>
        </div>
        <Canvas engine={props.engine} />
        <div class='right'>
        </div>
        
        </div>
}

export default Editor;