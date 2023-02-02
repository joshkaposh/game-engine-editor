import type { ClassKeys,ClassTypes } from "../../objects";
import { createSignal, createEffect, on, Signal } from "solid-js";
import GameEngine from "../../game-engine";
import ObjectBuilder from "../editor/ObjectBuilder";
import { createStore } from "solid-js/store";

export const builderSignals = () => {
    const mode = createSignal<'Create' | 'Repeat' | 'Edit'>('Create', { equals: false })
    //*keep previous values
    const keep = createSignal(false);
    //*edit
    const index = createSignal<number | undefined>(undefined, { equals: false })
    const selectedObject = createSignal<ClassTypes>()

    //*repeat
    const gap = createStore({ x: 0, y: 0 })
    const enabled = createSignal(false)
    const count = createSignal(0)
    return {
        mode,
        keep,
        index,
        selectedObject,
        repeat:{gap,count,enabled}
    }

}

export const builderEffects = (dict: GameEngine['dict'], signals: ReturnType<typeof builderSignals> & {
    selected: Signal<ClassKeys | undefined>;
    builder: Signal<ObjectBuilder | undefined>
}) => {
    const { mode, index, selected, builder,repeat:{enabled},selectedObject } = signals;
    const { objects } = dict

    createEffect(() => {
        console.log('SelectedObject: ',selectedObject[0]());
    })

    createEffect(on(index[0], (i) => {
        if (i !== undefined) {
            mode[1]('Edit')
            builder[1](ObjectBuilder.edit(objects[selected[0]()!][i] as ClassTypes))
            selectedObject[1](objects[selected[0]()!][i] as ClassTypes)
            return
        }
        builder[1](ObjectBuilder.new(selected[0]()!))
        selectedObject[1]()
        mode[1]('Create')
    }, { defer: true }))
    
    createEffect(on(enabled[0], r => {
        if (r) mode[1]('Repeat');
        else mode[1]('Create')
    }, { defer: true }))

    createEffect(() => {
        console.log('Mode was changed to:',mode[0]());
    })

    return signals
}
