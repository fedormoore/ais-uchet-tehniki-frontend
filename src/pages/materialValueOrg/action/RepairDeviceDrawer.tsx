import React, {FC, useEffect, useState} from 'react';
import {Button, Drawer, Form, Layout, Space} from "antd";
import {useActions} from "../../../hooks/useActions";
import {RepairDeviceModel} from "../../../models/materialValueOrg/RepairDeviceModel";
import TextArea from "antd/es/input/TextArea";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import {
    MaterialValueOrgActionCreators,
    storageResult
} from "../../../reducers/materialValueOrg/materialValueOrgActionCreators";
import {getDeviceName} from "../../../components/storage";
import CardView from "./CardView";
import ReasonSelect from "../../../components/ui/select/ReasonSelect";
import MaterialValueOrgInput from "../../../components/ui/input/MaterialValueOrgInput";

interface RepairDeviceDrawerProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    valueSpec: MaterialValueOrgModel[];
    resetSelect: () => void;
}

const RepairDeviceDrawer: FC<RepairDeviceDrawerProps> = (props) => {

    const [form] = Form.useForm();

    // const {setNotification} = useActions(AppActionCreators);
    const {saveRepairDevice, storageLoadFromServer} = useActions(MaterialValueOrgActionCreators);

    const [values, setValues] = useState<RepairDeviceModel[]>([{} as RepairDeviceModel]);

    const [excludeData, setExcludeData] = useState<MaterialValueOrgModel[]>([]);

    useEffect(() => {
        if (props.valueSpec.length > 0) {
            let newArrValue: RepairDeviceModel[] = [];
            for (let i = 0; i < props.valueSpec.length; i++) {
                newArrValue = newArrValue.concat({device: props.valueSpec[i]} as RepairDeviceModel)
                form.setFieldsValue(
                    {
                        [i + 'device']: getDeviceName(props.valueSpec[i].materialValue)
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
                    const result: storageResult = await saveRepairDevice(values) as storageResult;
                    if (result.isOk) {
                        storageLoadFromServer();
                        props.resetSelect();
                        props.closeDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        setValues([...values.concat({} as RepairDeviceModel)])
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

        const refreshField = (newArr: RepairDeviceModel[]) => {
            for (let i = 0; i < newArr.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'statement']: newArr[i].statement?.id,
                        [i + 'device']: getDeviceName(newArr[i].device?.materialValue),
                        [i + 'note']: newArr[i].note,
                    }
                );
            }
        }

        return (
            <CardView typeModel={"RepairDeviceModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <ReasonSelect load={loadSelect} buttonAdd={true} name={index + 'statement'}
                                            reasonType={"statement"}
                                            rulesOn={false}
                                            onChange={(value) => changeField(index, "statement", value)}/>
                              <MaterialValueOrgInput name={index + 'device'} rulesOn={true}
                                                     label={'Материальная ценность'}
                                                     onChange={(value) => changeField(index, "device", value)}
                                                     typeUrl={'getAllMaterialValueOrgByAddOtherTrue'}
                                                     excludeData={excludeData}/>

                              <TextArea rows={4} onChange={(e) => changeField(index, "note", e.target.value)}/>
                          </>}
            />
        )
    }

    const setExclude = () => {
        let tmp: MaterialValueOrgModel[] = []
        values.forEach((item) => {
            if (item.device !== undefined) {
                tmp = tmp.concat(item.device)
            }
        })
        setExcludeData(tmp)
    }

    return (
        <Drawer
            title={'Ремонт МЦ'}
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
            <Layout className={'parentTable'}>
                <Form form={form} layout="vertical" preserve={false}>
                    {viewAddField()}
                </Form>
            </Layout>
            {/*{viewRepairDeviceDeviceListDrawer &&*/}
            {/*    <RepairDeviceDeviceListDrawer*/}
            {/*        selectRecords={values.specification} openDrawer={viewRepairDeviceDeviceListDrawer}*/}
            {/*        closeDrawer={() => setViewRepairDeviceDeviceListDrawer(!viewRepairDeviceDeviceListDrawer)}*/}
            {/*        saveRecord={(value) => saveSpec(value)}/>*/}
            {/*}*/}
        </Drawer>
    );
};

export default RepairDeviceDrawer;