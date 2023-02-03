import type { Component, Signal } from 'solid-js'
import type { ClassKeys } from "../../../objects";
import { Show } from 'solid-js';
import CreateObjectBtn from './input/CreateObjectBtn';
import { ToggleCheckbox } from './input/Input';
import { builderSignals, builderEffects } from '../../signals/createBuilder';
import GameEngine from '../../../game-engine';
import ObjectBuilder from "../ObjectBuilder";
import RepeatMode from './modes/RepeatMode';
import EditMode from './modes/EditMode';
import RecurseEntries from './RecurseEntries';

export type Paths = { [key: string]: string[]  }
export type UnknownObject = { [key: string]: unknown }

export interface FormProps {
    builder: Signal<ObjectBuilder | undefined>
    selected:Signal<ClassKeys | undefined>
}

const EditObjectForm: Component<FormProps & {
    length: number;
    dict:GameEngine['dict']

}> = (props) => {
    const { dict,builder,selected } = props
    const builder_signals = builderSignals()
    const {mode,keep,index,repeat} = builderEffects(props.dict,{...builder_signals,builder,selected})
    const resetBuilder = (b:ObjectBuilder) => {
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
        <RecurseEntries
            builder={props.builder[0]()!}
        />
        <hr class='form-section' />
        <div class='form-tools'>
            <ToggleCheckbox signal={keep} text='Keep' />
            <RepeatMode
                count={repeat.count}
                setGap={repeat.gap[1]}
                toggled={repeat.enabled[0]}
                toggle={() => repeat.enabled[1](!repeat.enabled[0]())}
            />
        </div>
        <CreateObjectBtn
            setIndex={index[1]}
            setRepeat={repeat.enabled[1]}
            mode={mode[0]}
            create={() => {
                const b = builder[0]()!
                dict.add(b.build())
                resetBuilder(b)
            }}
            createMany={() => {
                console.log('Create Many!');
                if (repeat.count[0]() === 0) return

                ObjectBuilder.repeat(builder[0]()!,(go) => dict.add(go), {
                    count: repeat.count[0](),
                    gap: repeat.gap[0]
                })
                resetBuilder(builder[0]()!)
            }}
        />
    </form>
}

export default EditObjectForm;