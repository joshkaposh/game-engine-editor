import type { ClassKeys } from "../../../objects";
import { createSignal, createEffect,on } from "solid-js";
import ObjectBuilder from "../ObjectBuilder";
import GameEngine from "../../../game-engine/initialize";

const createEffects = (engine:GameEngine,signals:ReturnType<typeof createSignals>) => {
    const { runningSignal, selected, setBuilder } = signals;
    
    createEffect(() => {
        runningSignal[0]() ?
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
    const selectedSignal = createSignal<ClassKeys>()
    const indexSignal = createSignal<number>()
    const keepPrevSignal = createSignal(false);
    const runningSignal = createSignal(false)
    const toggleKeepPrev = () => keepPrevSignal[1](!keepPrevSignal[0]()) 
    const select = (type: ClassKeys) => {
        if (type === selectedSignal[0]()) {
            selectedSignal[1](undefined);
            return;
        }
        selectedSignal[1](type)
        return;
    }

    return {
        keepPrev: keepPrevSignal[0],
        selected:selectedSignal[0],
        toggleKeepPrev,
        select,
        builder,
        setBuilder,
        runningSignal,
        indexSignal,
    }

}

const create = (engine:GameEngine) => {
    const signals = createSignals();
    createEffects(engine,signals)
    return signals;
}

export default create;