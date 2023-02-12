import React, {FC, useEffect, useState} from 'react';
import {Button, Drawer, Form, Space} from "antd";
import {useActions} from "../../../hooks/useActions";
import {RepairCartridgeModel} from "../../../models/materialValueOrg/RepairCartridgeModel";
import LocationTreeSelect from "../../../components/ui/treeSelect/LocationTreeSelect";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import {
    MaterialValueOrgActionCreators,
    storageResult
} from "../../../reducers/materialValueOrg/materialValueOrgActionCreators";
import {getDeviceName} from "../../../components/storage";
import CardView from "./CardView";
import ReasonSelect from "../../../components/ui/select/ReasonSelect";
import MaterialValueOrgInput from "../../../components/ui/input/MaterialValueOrgInput";

interface RepairCartridgeDrawerProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    cartridge: MaterialValueOrgModel[];
    resetSelect: () => void;
}

const ReplacementCartridgeDrawer: FC<RepairCartridgeDrawerProps> = (props) => {

    const [form] = Form.useForm();

    const {saveReplacementCartridge, storageLoadFromServer} = useActions(MaterialValueOrgActionCreators);

    const [values, setValues] = useState<RepairCartridgeModel[]>([{} as RepairCartridgeModel]);

    const [excludeData, setExcludeData] = useState<MaterialValueOrgModel[]>([]);

    useEffect(() => {
        if (props.cartridge.length > 0) {
            let newArrValue: RepairCartridgeModel[] = [];
            for (let i = 0; i < props.cartridge.length; i++) {
                newArrValue = newArrValue.concat({cartridge: props.cartridge[i]} as RepairCartridgeModel)
                form.setFieldsValue(
                    {
                        [i + 'cartridge']: getDeviceName(props.cartridge[i].materialValue)
                    }
                );
            }
            setValues(newArrValue)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: storageResult = await saveReplacementCartridge(values) as storageResult;
                    if (result.isOk) {
                        storageLoadFromServer();
                        props.resetSelect();
                        props.closeDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        setValues([...values.concat({} as RepairCartridgeModel)])
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: any) => {
            values[index] = {...values[index], [name]: value};
            setValues([...values])
            refreshField(values)
            setExclude();
        }

        const removeField = (event: React.MouseEvent, index: number) => {
            event.stopPropagation()

            values.splice(index, 1);

            refreshField(values);
            setExclude();
        }

        const refreshField = (newArr: RepairCartridgeModel[]) => {
            for (let i = 0; i < newArr.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'statement']: newArr[i].statement?.id,
                        [i + 'location']: newArr[i].location?.id,
                        [i + 'printer']: getDeviceName(newArr[i].printer?.materialValue),
                        [i + 'cartridge']: getDeviceName(newArr[i].cartridge?.materialValue),
                    }
                );
            }
        }

        return (
            <CardView typeModel={"RepairCartridgeModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <ReasonSelect load={loadSelect} buttonAdd={true} name={index + 'statement'}
                                            reasonType={'statement'}
                                            rulesOn={false}
                                            onChange={(value) => changeField(index, "statement", value)}/>
                              <LocationTreeSelect load={loadSelect} buttonAdd={true} name={index + 'location'}
                                                  rulesOn={true} locationType={'storage'}
                                                  onChange={(value) => changeField(index, "location", value)}/>
                              <MaterialValueOrgInput name={index + 'printer'} rulesOn={true} label={'Принтер'}
                                                     onChange={(value) => changeField(index, "printer", value)}
                                                     typeUrl={'allPrinterInCabinet'} excludeData={excludeData}/>
                              <MaterialValueOrgInput name={index + 'cartridge'} rulesOn={true} label={'Картридж'}
                                                     onChange={(value) => changeField(index, "cartridge", value)}
                                                     typeUrl={'allCartridgeFull'} excludeData={excludeData}/>
                          </>}
            />
        )
    }

    const setExclude = () => {
        let tmp: MaterialValueOrgModel[] = []
        values.forEach((item) => {
            if (item.printer !== undefined) {
                tmp = tmp.concat(item.printer)
            }
            if (item.cartridge !== undefined) {
                tmp = tmp.concat(item.cartridge)
            }
        })
        setExcludeData(tmp)
    }

    return (
        <Drawer
            title={'Замена картриджа'}
            width={'650px'}
            bodyStyle={{padding: "0px"}}
            closable={false}
            open={props.openDrawer}
            extra={
                <Space>
                    <Button onClick={props.closeDrawer}>Отмена</Button>
                    <Button onClick={() => onClickAddField()}>Добавить</Button>
                    <Button type="primary" onClick={() => onClickSaveRecord()}>Сохранить</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" preserve={false}>
                {viewAddField()}
            </Form>
            {/*{viewRepairCartridgeCartridgeListDrawer &&*/}
            {/*    <RepairCartridgeCartridgeListDrawer*/}
            {/*        selectRecords={values.specification} openDrawer={viewRepairCartridgeCartridgeListDrawer}*/}
            {/*        closeDrawer={() => setViewRepairCartridgeCartridgeListDrawer(!viewRepairCartridgeCartridgeListDrawer)}*/}
            {/*        saveRecord={(value) => saveSpec(value)}/>*/}
            {/*}*/}
        </Drawer>
    );
};

export default ReplacementCartridgeDrawer;