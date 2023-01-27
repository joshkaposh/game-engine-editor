import type { ClassKeys } from "../../../objects";
import { createSignal, createEffect,on } from "solid-js";
import ObjectBuilder from "../ObjectBuilder";
import GameEngine from "../../../game-engine/initialize";

const createEffects = (engine:GameEngine,signals:ReturnType<typeof createSignals>) => {
    const { running, selected, setBuilder } = signals;
    
    createEffect(() => {
        running[0]() ?
            engine.start() :
            engine.stop();
    })

    createEffect(on(selected, (type) => {
        !type ?
            setBuilder() :
            setBuilder(new ObjectBuilder(type));
    }, { defer: true }))

}

const createSignals = () => {
    const [builder, setBuilder] = createSignal<ObjectBuilder>()
    const mode = createSignal<'Create'  | 'Repeat' | 'Edit'>('Create',{equals:false})
    const index = createSignal<number>()
    const count = createSignal(0);
    const repeat = createSignal(false)
    const selected = createSignal<ClassKeys>()
    const keepPrev = createSignal(false);
    const running = createSignal(false)
    const toggleKeepPrev = () => keepPrev[1](!keepPrev[0]()) 
    const select = (type: ClassKeys) => {
        if (type === selected[0]()) {
            selected[1](undefined);
            return;
        }
        selected[1](type)
        return;
    }

    return {
        keepPrev: keepPrev[0],
        selected:selected[0],
        toggleKeepPrev,
        select,
        builder,
        setBuilder,
        running,
        index,
        count,
        repeat,
        mode
    }

}

const create = (engine:GameEngine) => {
    const signals = createSignals();
    createEffects(engine,signals)
    return signals;
}

export default create;