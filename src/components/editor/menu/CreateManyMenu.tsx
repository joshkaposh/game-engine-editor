import { Component, createEffect, Setter, Signal } from 'solid-js'
import { createSignal } from 'solid-js';
import { Button, Label, Number } from '../form/input/Input';
import Menu from './Menu';
import createToggleSignal from '../signals/createToggleSignal';
import { SetStoreFunction, Store } from 'solid-js/store';
export type Multiplier = 1 | 10 | 100 | 1000 

const Buttons: Component<{
    inc: (num:number) => void;
    dec: (num: number) => void;
    multiplier?: Multiplier
}> = (props) => {
    const { multiplier = 1 } = props;
    
    return <li class='counter-btn-li'>
        <Button class='counter-btn-inc' handleClick={e => {
            e.preventDefault();
            props.inc(multiplier);
        }}>
            + {multiplier}
        </Button>
        <Button class='counter-btn-dec' handleClick={e => {
            e.preventDefault();
            props.dec(multiplier)
        }}>
            - {multiplier}
        </Button>
    </li>
    }

const CountInput: Component<{
    key: string;
    setCount: Setter<number>;
}> = (props) => {
    return <div class='counter'>
        <Label for={props.key} />
        <Number class='counter-input'
            min={1}
            relay={(num) => props.setCount(num)}
        />
        <Button handleClick={e => {
            e.preventDefault();
            props.setCount(1);
            }}>
                Reset
            </Button>
    </div>
}
const GapInput: Component<{ key: "x" | 'y', setGap: (key: "x" | 'y',value:number) => void; }> = ({key,setGap}) => {
    
    return <div class='counter'>
        <Label for={key} />
        <Number class='counter-input' min={0} relay={
            (num) => {
                setGap(key as any,num)
            }}
        />
        <Button handleClick={e => {
                e.preventDefault();
                setGap(key,0)
            }}>
                Reset
            </Button>
    </div>
}


const CreateManyMenu: Component<{
    gap: Store<{ x: number; y: number }>
    setGap: SetStoreFunction<{ x: number; y: number }>
    setMode: (m:'Create' | 'Repeat' | 'Edit') => void;
    countSignal: Signal<number>;
}> = (props) => {
    const [clicked,_,toggle] = createToggleSignal();
    
    return <Menu select={() => {
        props.setMode('Repeat')
        
    }} open='Many' clicked={clicked()} toggle={toggle}  >
        <Label for='Gap' />
        <GapInput key='x' setGap={props.setGap} />
        <GapInput key='y' setGap={props.setGap} />
        <CountInput key='Count' setCount={props.countSignal[1]} />
    </Menu>
}

export default CreateManyMenu