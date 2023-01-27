import type {  Accessor, Component, Setter, Signal, } from 'solid-js'
import type { ClassKeys, ClassTypes } from "../../../objects";
import type { LengthStore, ObjectDict } from "../../../game-engine/initialize";
import { createEffect, on, Show, createSignal } from "solid-js";
import { createStore } from 'solid-js/store';
import SelectFromArray from '../menu/SelectFromArray';
import ObjectBuilder, { SetBuilder } from "../ObjectBuilder";
import CreateObjectBtn from './input/CreateObjectBtn';
import RecurseEntries from './RecurseEntries';
import Repeat from '../menu/Repeat';

export type Paths = { [key: string]: string[] }
export type UnknownObject = { [key: string]: unknown }

export interface FormProps {
    type: ClassKeys;
    builder: ObjectBuilder
    create: (type: ClassTypes, count?:number) => void;
}
const EditObjectForm: Component<FormProps & {
    lengthStore: LengthStore;
    objects: ObjectDict;
    setBuilder: SetBuilder;
    mode: Accessor<'Create' | 'Repeat' | 'Edit'>;
    setMode: Setter<'Create' | 'Repeat' | 'Edit'>;
    indexSignal:Signal<number | undefined>
    countSignal: Signal<number>;
    repeatSignal: Signal<boolean>;
}> = (props) => {

    const edit = () => {
        props.indexSignal[1]();
        props.setBuilder(new ObjectBuilder(props.type))
        props.setMode('Create');
    }
    const repeat = () => {
        props.create(props.builder.build(),props.countSignal[0]())
        props.setMode('Create')
    }
    const create = () => {
        props.create(props.builder.build())
    }

    const handleCreate = () => {
        switch (props.mode()) {
            case 'Edit':
                edit();
                return;
            case 'Repeat':
                repeat();
                return;
            case 'Create':
                create()
                return;
            default:
                throw new Error('No mode was found :' + props.mode())
        }
    }
    createEffect(on(props.indexSignal[0], (i) => {
        console.log('index was changed to ',i);
        
        if (i !== undefined) {
          props.setBuilder(new ObjectBuilder(props.objects[props.type][i] as ClassTypes))
        }
    }, { defer: true }))
    

    createEffect(on(props.repeatSignal[0], (repeat) => {

    }, { defer: true }))
    
    // TODO: create a better way of handling state
    //* Type Signature = undefined | ObjectBuilder
    //* 0 = setBuilder()
    //* 1 = setBuilder(new Builder(type)
    //* 2 = setBuilder(new Builder(type,{ keep }))
    //* 3 = setBuilder(new Builder(type,{ keep, repeat }))
    //? Goal: create effect for handling each scenario
    //? select effect handles first two


    return <form class='object-form'>
        <div class='form-header'>
            <h2>{props.type}</h2>
        </div>
        <div class='form-menus'>
            <Repeat
                countSignal={props.countSignal}
                toggled={props.repeatSignal[0]}
                toggle={() => {
                    props.repeatSignal[1](!props.repeatSignal[0]())
                }}
            />
            <Show when={props.lengthStore[props.type] > 0}>
                <SelectFromArray
                    type={props.type}
                    length={props.lengthStore[props.type]}
                    index={props.indexSignal[0]}
                    setIndex={props.indexSignal[1]}
                    setMode={props.setMode}
                />            
            </Show>
        </div>
        <RecurseEntries
            builder={props.builder}
            config={props.builder.root}
            depth={0}
            repeat={props.repeatSignal[0]}
        />
        <CreateObjectBtn
            handleCreate={handleCreate}
            mode={props.mode}
        />
    </form>
}

export default EditObjectForm;