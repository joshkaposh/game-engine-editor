import type { Component, ParentComponent } from "solid-js";
import { Show, children,createSignal } from "solid-js";

interface MenuProps {
    select: () => void;
}

const ToggleMenu: Component<{
    text:string;
    toggle: () => void
}> = (props) => {
    return <button type='button' onclick={(e) => {
        e.preventDefault();
        props.toggle();
    }}> 
    {props.text}
</button>
    }

export const CollapseableMenu: ParentComponent<MenuProps & {
    open: string;
    close: string;
}> = (props) => {
    const [open,setOpen] = createSignal(false)
    const c = children(() => props.children)
    return <div class='menu-container'>
        <button onclick={(e) => {
            e.preventDefault();
            setOpen(!open());
        }}>
            {open() ? props.close : props.open}
        </button>
        <Show when={open()}>
            <div class='object-menu'>
                <div class='object-menu-body'>
                    {c}
                </div>
                <div class='object-menu-submit'>
                    <button onclick={(e) => {
                        e.preventDefault();
                        setOpen(!open());
                        props.select();
                    }}>
                        Select
                    </button>
                </div>
            </div>
        </Show>
    </div>
}

const Menu: ParentComponent<MenuProps & {
    clicked: boolean;
    toggle: () => void;
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
                <button onclick={(e) => {
                    e.preventDefault();
                    props.toggle();
                    props.select();
                }}>
                    Select
                </button>
            </div>
        </div>
    </Show>
    }

export default Menu;