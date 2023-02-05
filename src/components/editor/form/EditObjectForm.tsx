import type { Component, Signal } from 'solid-js'
import type { ClassKeys } from "../../../objects";
import { Show } from 'solid-js';
import CreateObjectBtn from './input/CreateObjectBtn';
import { Checkbox } from './input/Input';
import RepeatMode from './modes/RepeatMode';
import EditMode from './modes/EditMode';
import Entries from './Entries';
import GameEngine from '../../../game-engine';
import ObjectBuilder, { Fields } from "../ObjectBuilder";
import { modeEffects } from './modeEffects';

export type Paths = { [key: string]: string[] }
export type UnknownObject = { [key: string]: unknown }

export interface FormProps {
    builder: Signal<ObjectBuilder | undefined>
    selected: Signal<ClassKeys | undefined>
}

const EditObjectForm: Component<FormProps & {
    length: number;
    dict: GameEngine['dict']
    fields: ([string, string, unknown] | [string, string[], unknown[]])[];

}> = (props) => {
    const { dict, builder, selected } = props
    const { mode, keep, index, repeat } = modeEffects(props.dict, { builder, selected })
    const resetBuilder = (b: ObjectBuilder) => {
        !keep[0]() ?
            builder[1](ObjectBuilder.new(b.type)) :
            builder[1](ObjectBuilder.keep(b))
    }
    return <form class='object-form'>
        <hr />
        <div class='form-modes'>
            <label>Operations:</label>
            <ul class='form-operations'>
                <Show when={props.length > 0}>
                    <EditMode
                        length={props.length}
                        index={index[0]}
                        setIndex={index[1]}
                        setMode={mode[1]}
                    />
                </Show>
            </ul>
        </div>
        <hr class='form-section' />
        <Entries
            builder={props.builder[0]()!}
            fields={props.fields}
        />
        <hr class='form-section' />
        <div class='form-tools'>
            <div>
                <label>Keep</label>
                <Checkbox signal={keep} initialValue={keep[0]()} />
            </div>
            <RepeatMode
                count={repeat.count}
                setGap={repeat.gap[1]}
                toggled={repeat.enabled[0]}
                toggle={() => repeat.enabled[1](!repeat.enabled[0]())}
            />
        </div>
        <CreateObjectBtn
            mode={mode[0]}
            create={() => {
                const b = builder[0]()!
                dict.add(b.build())
                resetBuilder(b)
            }}
            edit={() => {
                console.log('Create::Edit Ran');
                index[1]();
            }}
            repeat={() => {
                console.log('Create::Repeat Ran');
                console.log('Create Many!');
                if (repeat.count[0]() === 0) return

                ObjectBuilder.repeat(builder[0]()!, (go) => dict.add(go), {
                    count: repeat.count[0](),
                    gap: repeat.gap[0]
                })
                resetBuilder(builder[0]()!)
                repeat.enabled[1](false);
            }}
        />
    </form>
}

export default EditObjectForm;