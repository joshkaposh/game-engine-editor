import { Component, For, Switch } from "solid-js"
import ObjectBuilder,{createPaths} from "../ObjectBuilder"
import MatchPrimitives from "./input/Primitives";

const RecurseEntries: Component<{
    builder:ObjectBuilder
}> = (props) => {
    const fields = createPaths(props.builder.root);
    return <div class='form-entries'>
        <For each={fields}>{(field) => {

            return <div>
                <label>{field.path}</label>
                <Switch>
                    <MatchPrimitives
                        field={field}
                        relay={(key,value) => {
                            props.builder.updateProperty(field.path,key,value)
                        }}
                    />
                </Switch>
            </div>
        }}</For>        
    </div>
}

export default RecurseEntries