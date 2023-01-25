import type { Accessor, Component, Setter  } from 'solid-js'
import type { ClassKeys } from '../../objects';
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

const KeepPrevious: Component<{
    isTrue: Accessor<boolean>;
    toggle: () => void;
}> = (props) => {
    return <div class='toggle-keep-previous'>
        <label>Keep</label>
        <input type='checkbox'
            checked={props.isTrue()}
            onchange={(e) => {
            e.preventDefault();
            props.toggle();
        }}
        />
</div>
}

const Editor: Component<{
    engine: GameEngine
}> = ({engine}) => {
    const { runningSignal, selected, select, builder, setBuilder,keepPrev,toggleKeepPrev,indexSignal } = create(engine)


return <div id='editor'>
    <div class='left'>
        <div class='left-header'>
            <Play isRunning={runningSignal[0]} setRunning={runningSignal[1]} />            
            <KeepPrevious isTrue={keepPrev} toggle={toggleKeepPrev} />
        </div>
        <SelectObject types={Object.keys(objects)} select={select} />
        <Show when={selected() && builder()}>
            <EditObjectForm
                lengthStore={engine.dict.lengthStore}
                objects={engine.dict.objects}
                type={selected()!}
                builder={builder()!}
                setBuilder={setBuilder}
                create={(type) => {
                    engine.dict.add(type)
                    if (!keepPrev()) {
                        setBuilder(new ObjectBuilder(type.goName as ClassKeys))
                    return
                    }
                    const prev = builder();
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