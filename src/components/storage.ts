import {MaterialValueOrgModel} from "../models/MaterialValueOrgModel";
import {MaterialValueModel} from "../models/spr/MaterialValueModel";

export const isParent: any = (children: MaterialValueOrgModel, tree: MaterialValueOrgModel[]) => {
    let childrenFind: boolean = false;
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].children !== undefined) {
            for (let y = 0; y < tree[i].children.length; y++) {
                if (tree[i].children[y].id === children.id) {
                    return true;
                } else {
                    childrenFind = isParent(children, tree[i].children)
                    if (childrenFind) {
                        return childrenFind;
                    }
                }
            }
        }
    }
    return childrenFind;
};

export const getDeviceName = (record: MaterialValueModel) => {
    if (record !== undefined && record !== null) {
        if ((record.nameInOrg! !== undefined && record.nameInOrg! !== "" && record.nameInOrg! !== null) && (record.nameFirm !== undefined && record.nameFirm !== "")) {
            return record.materialValueType.name + " " + record.nameInOrg + " (" + record.nameFirm + " " + record.nameModel + ")"
        }
        if (record.nameInOrg! !== undefined && record.nameInOrg! !== "" && record.nameInOrg! !== null) {
            return record.materialValueType.name + " " + record.nameInOrg
        }
        if (record.nameFirm !== undefined && record.nameFirm !== "") {
            return record.materialValueType.name + " " + record.nameFirm + " " + record.nameModel
        }
    }
    return ""
}