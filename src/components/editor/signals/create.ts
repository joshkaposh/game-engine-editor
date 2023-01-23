import type { Accessor, Setter } from "solid-js";
import type { ClassKeys } from "../../../objects";
import { createSignal, createEffect } from "solid-js";
import ObjectBuilder from "../ObjectBuilder";
import GameEngine from "../../../game-engine/initialize";

const createEffects = (selected: Accessor<ClassKeys | undefined>, setBuilder: Setter<ObjectBuilder | undefined>, isRunning: Accessor<boolean>, engine: GameEngine) => {
    createEffect(() => {
        isRunning() ?
            engine.start() :
            engine.stop();
    })
    
    createEffect(() => {
        if (!selected()) {
            setBuilder();
            return
        }
        setBuilder(new ObjectBuilder(selected()!));
        return
})
}

const createSignals = () => {
    const [selected, setSelected] = createSignal<ClassKeys>()
    const [builder,setBuilder] = createSignal<ObjectBuilder>()
    const [isRunning,setRunning] = createSignal(false)

    const select = (type: ClassKeys) => {
        if (type === selected()) {
            setSelected(undefined);
            return;
        }
        setSelected(type)
        return;
    }

    return {
        builder,
        setBuilder,
        selected,
        select,
        isRunning,
        setRunning
    }

}

const create = (engine:GameEngine) => {
    const signals = createSignals();
    createEffects(signals.selected,signals.setBuilder,signals.isRunning,engine)
    return signals;
}

export default create;