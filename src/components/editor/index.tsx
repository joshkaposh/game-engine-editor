import type { Component } from 'solid-js'
import type { ClassKeys } from '../../objects';
import { Show, createEffect, createSignal, on, } from "solid-js";
import Select from "./Select";
import EditObjectForm from './form/EditObjectForm';
import Canvas from '../canvas/Canvas';
import createSignals from '../signals/createEngineSignals';
import GameEngine from '../../game-engine';
import { Toggle } from './form/input/Input';
import ObjectBuilder from './ObjectBuilder';

const Editor: Component<{
    engine: GameEngine
}> = (props) => {
    const { dict } = props.engine
    const { running } = createSignals(props.engine)
    const builder = createSignal<ObjectBuilder | undefined>(undefined,{equals:false})
    const selected = createSignal<ClassKeys | undefined>(undefined,{equals:false})

    createEffect(on(selected[0], (type) => {
        !type ?
            builder[1]() :
            builder[1](ObjectBuilder.new(type));
    }, { defer: true }))

    return <div id='editor'>
        <div>
            <ul class='engine-tools'>
                <Toggle signal={running} on='Start' off='Stop' />
            </ul>
            <hr />
            <Select types={Object.keys(dict.objects)} select={(type) => {
                type === selected[0]() ?
                    selected[1](undefined) :
                    selected[1](type)
            }}
            />
            <Show when={selected[0]() && builder[0]()}>
                <EditObjectForm
                    length={dict.lengthStore[selected[0]()!]}
                    selected={selected}
                    builder={builder}
                    dict={dict}
                />
            </Show>
        </div>
        <Canvas engine={props.engine} />
        <span />
    </div>
}

export default Editor;