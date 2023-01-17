import type { SetStoreFunction } from "solid-js/store";
import type { Indexable, Paths } from "./EditObject";

export const editProperty = (path: string[], root: Indexable, rootKey: string, property: string, value: string | number | boolean) => {
    console.log('EditProperty::', rootKey, property,value);
    
    if (path.length === 0) {
        root[rootKey][property] = value
        
    } else {
        let temp = root[rootKey]
        for (let i = 0; i < path.length; i++) {
            temp = temp[path[i]]
        }
        temp[property] = value;
    }
    console.log('EditPropery::Root',root);

}


export const setRootKeys = (root:Indexable,setPaths:SetStoreFunction<Paths>) => {
    const entries = Object.entries(root)
    for (const entry of entries) {
        if (canRecurse(entry[1])) {
            setPaths(entry[0],[])
        }
    }
}

export const canRecurse = (property: unknown) => typeof property === 'object' && !Array.isArray(property)

