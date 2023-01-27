import type { Component, ParentComponent } from "solid-js";
import { Show, children } from "solid-js";
import { Button } from "../form/input/Input";
import createToggleSignal from "../signals/createToggleSignal";

const ToggleMenu: Component<{
    text:string;
    toggle: () => void
}> = (props) => {
    return <Button type='button' handleClick={(e) => {
        e.preventDefault();
        props.toggle();
    }}> 
    {props.text}
</Button>
    }

export const CollapseableMenu: ParentComponent<{
    open: string;
    close: string;
    select: () => void;
}> = (props) => {
    const [open,_,toggle] = createToggleSignal()
    const c = children(() => props.children)
    return <div class='menu-container'>
        <Button handleClick={(e) => {
            e.preventDefault();
            toggle();
        }}>
            {open() ? props.close : props.open}
        </Button>
        <Show when={open()}>
            <div class='object-menu'>
                <div class='object-menu-body'>
                    {c}
                </div>
                <div class='object-menu-submit'>
                    <Button handleClick={(e) => {
                        e.preventDefault();
                        toggle();
                        props.select();
                    }}>
                        Select
                    </Button>
                </div>
            </div>
        </Show>
    </div>
}

const Menu: ParentComponent<{
    clicked: boolean;
    toggle: () => void;
    select: () => void;
    open?: string;
    exit?: string;
}> = (props) => {
    const c = children(() => props.children)

    return <Show when={props.clicked} fallback={<ToggleMenu text={props.open ?? 'Open'} toggle={props.toggle} />}>
        <div class='object-menu'>
            <div class="object-menu-header">
                <ToggleMenu text={props.exit ?? 'Close'} toggle={props.toggle} />
            </div>
            <div class='object-menu-body'>
                {c}
            </div>
            <div class='object-menu-submit'>
                <Button handleClick={(e) => {
                    e.preventDefault();
                    props.toggle();
                    props.select();
                }}>
                    Select
                </Button>
            </div>
        </div>
    </Show>
    }

export default Menu;