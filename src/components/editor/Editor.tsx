import type { Accessor, Component, Setter  } from 'solid-js'
import type { ClassKeys, Configs } from '../../objects';
import { Show } from "solid-js";
import SelectObject from "./SelectObject";
import EditObjectForm from './form/EditObjectForm';
import Canvas from '../canvas/Canvas';
import create from './signals/create';
import ObjectBuilder from './ObjectBuilder';
import objects from '../../objects';
import GameEngine from '../../game-engine/initialize';

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
}> = ({engine}) => {
    const {isRunning,setRunning,selected,select,builder,setBuilder} = create(engine)

    return <div id='editor'>
        <div class='left'>
            <Play isRunning={isRunning} setRunning={setRunning} />            
            <h2>Selected: {selected()}</h2>
            <SelectObject types={Object.keys(objects)} select={select} />
            <Show when={selected() && builder()}>
                <EditObjectForm
                    type={selected()!}
                    builder={builder()!}
                    create={(type) => {
                        const prev = builder();
                        engine.add(type)
                        setBuilder(new ObjectBuilder(type.goName as ClassKeys, prev))
                    }}
                />
            </Show>
        </div>
        <Canvas engine={engine} />
        <span class='right' />
        </div>
}

export default Editor;