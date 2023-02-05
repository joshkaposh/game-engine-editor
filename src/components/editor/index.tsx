import type { Component } from 'solid-js'
import type { ClassKeys } from '../../objects';
import { Show, createEffect, createSignal, on, } from "solid-js";
import Select from "./Select";
import EditObjectForm from './form/EditObjectForm';
import Canvas from '../canvas/Canvas';
import GameEngine from '../../game-engine';
import ObjectBuilder, { group } from './ObjectBuilder';

const engineSignals = () => {
    const running = createSignal(false)
    return {
        running,
    }
}

const engineEffects = (engine: GameEngine) => {
    const signals = engineSignals()

    createEffect(() => {
        signals.running[0]() ?
            engine.start() :
            engine.stop();
    })
    return signals
}

const Editor: Component<{
    engine: GameEngine
}> = (props) => {
    const { dict } = props.engine
    const { running } = engineEffects(props.engine)
    const selected = createSignal<ClassKeys | undefined>(undefined, { equals: false })
    const builder = createSignal<ObjectBuilder | undefined>(undefined, { equals: false })
    const [fields, setFields] = createSignal<ReturnType<typeof group> | undefined>(undefined, { equals: false })
    createEffect(on(selected[0], (type) => {
        if (!type) {
            builder[1]()
            setFields()

        } else {
            builder[1](ObjectBuilder.new(type));
            setFields(group(builder[0]()!.root))
        }
    }, { defer: true }))

    return <div id='editor'>
        <div>
            <ul class='engine-tools'>
                <button onclick={(e) => {
                    e.preventDefault();
                    running[1](!running[0]());
                }}>
                    {running[0]() ? 'Start' : 'Stop'}
                </button>
            </ul>
            <hr />
            <Select types={Object.keys(dict.objects)} select={(type) => {
                type === selected[0]() ?
                    selected[1](undefined) :
                    selected[1](type as ClassKeys)
            }}
            />
            <Show when={selected[0]() && builder[0]()}>
                <EditObjectForm
                    length={dict.lengthStore[selected[0]()!]}
                    selected={selected}
                    builder={builder}
                    dict={dict}
                    fields={fields()! as any}
                />
            </Show>
        </div>
        <Canvas engine={props.engine} />
        <span />
    </div>
}

export default Editor;