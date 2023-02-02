import type { Accessor, Component,Setter,Signal  } from "solid-js";
import ObjectBuilder from "../../ObjectBuilder";

const CreateObjectBtn: Component<{
    mode: Accessor<'Create' | 'Repeat' | 'Edit'>;
    setRepeat: Setter<boolean>;
    setIndex: Setter<number | undefined>;
    create: () => void;
    createMany: () => void;
}> = (props) => {
    const {mode,setIndex,setRepeat,create,createMany } = props;
    return <button type="submit" onclick={(e) => {
        e.preventDefault();
        switch (mode()) {
            case 'Edit':
                console.log('Create::Edit Ran');
                setIndex();
                return;
            case 'Repeat':
                console.log('Create::Repeat Ran');
                createMany()
                setRepeat(false)
                return;
            case 'Create':
                create()
                return;
            default:
                throw new Error('No mode was found :' + mode())
        }
    }}>
        {mode() === 'Edit' ? 'Finish' : mode()}
    </button>
}

export default CreateObjectBtn
