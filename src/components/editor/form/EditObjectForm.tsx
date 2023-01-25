import type { Component, } from 'solid-js'
import type { ClassKeys, ClassTypes } from "../../../objects";
import type { LengthStore, ObjectDict } from "../../../game-engine/initialize";
import { createEffect, on, Show, createSignal } from "solid-js";
import SelectFromArray from './input/SelectFromArray';
import ObjectBuilder, { SetBuilder } from "../ObjectBuilder";
import CreateObjectBtn from './input/CreateObjectBtn';
import RecurseEntries from './RecurseEntries';

export type Modes = 'Create' | 'Edit';
export type Paths = { [key: string]: string[] }
export type UnknownObject = { [key: string]: unknown }

export interface FormProps {
    type: ClassKeys;
    builder: ObjectBuilder
    create: (type: ClassTypes) => void;
}

const EditObjectForm: Component<FormProps & {
    lengthStore: LengthStore;
    objects: ObjectDict;
    setBuilder: SetBuilder;
}> = (props) => {
    const [mode,setMode] = createSignal<Modes>('Create')
    const [index,setIndex] = createSignal<number>()
    
    createEffect(on(index, (i) => {
        if (i !== undefined) {
          props.setBuilder(new ObjectBuilder(props.objects[props.type][i] as ClassTypes))
        }
    },{defer:true}))

    return <form class='object-form'>
        <div class='form-header'>
            <h2>{props.type}</h2>
            <Show when={props.lengthStore[props.type] > 0}>
                <SelectFromArray
                    type={props.type}
                    length={props.lengthStore[props.type]}
                    index={index}
                    setIndex={setIndex}
                    mode={mode}
                    setMode={setMode}
                />            
            </Show>
        </div>
        <RecurseEntries
            builder={props.builder}
            config={props.builder.root}
            depth={0}
            mode={mode}
            setMode={setMode}
        />
        <CreateObjectBtn
            type={props.type}
            builder={props.builder}
            setBuilder={props.setBuilder}
            create={props.create}
            mode={mode}
            setMode={setMode}
            resetIndex={() => {setIndex()}}
        />
    </form>
}

export default EditObjectForm;