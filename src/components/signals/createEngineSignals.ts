import { createSignal, createEffect } from "solid-js";
import GameEngine from "../../game-engine";
import { builderSignals, builderEffects } from './createBuilder'

const engineEffects = (engine: GameEngine, signals: ReturnType<typeof engineSignals>) => {
    const { running } = signals;
    createEffect(() => {
        running[0]() ?
            engine.start() :
            engine.stop();
    })
}

const engineSignals = () => {
    const running = createSignal(false)
    return {
        running,
    }
}

export default (engine:GameEngine) => {
    const engine_signals = engineSignals();
    engineEffects(engine, engine_signals)
    return engine_signals
}