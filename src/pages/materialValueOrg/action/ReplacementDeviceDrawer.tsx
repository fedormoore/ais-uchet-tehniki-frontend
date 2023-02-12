import React, {FC, useEffect, useState} from 'react';
import {Button, Drawer, Form, Layout, Space} from "antd";
import {useActions} from "../../../hooks/useActions";
import {ReplacementDeviceModel} from "../../../models/materialValueOrg/ReplacementDeviceModel";
import BudgetAccountSelect from "../../../components/ui/select/BudgetAccountSelect";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import LocationTreeSelect from "../../../components/ui/treeSelect/LocationTreeSelect";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import {
    MaterialValueOrgActionCreators,
    storageResult
} from "../../../reducers/materialValueOrg/materialValueOrgActionCreators";
import {getDeviceName, isParent} from "../../../components/storage";
import CardView from "./CardView";
import ReasonSelect from "../../../components/ui/select/ReasonSelect";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import MaterialValueOrgInput from "../../../components/ui/input/MaterialValueOrgInput";

interface ReplacementDeviceDrawerProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    valueSpec: MaterialValueOrgModel[];
    resetSelect: () => void;
}

const ReplacementDeviceDrawer: FC<ReplacementDeviceDrawerProps> = (props) => {

    const [form] = Form.useForm();
    const {
        storageList
    } = useTypedSelector(state => state.registry)
    const {setNotification} = useActions(AppActionCreators);
    const {saveReplacementDevice, storageLoadFromServer} = useActions(MaterialValueOrgActionCreators);

    const [values, setValues] = useState<ReplacementDeviceModel[]>([{} as ReplacementDeviceModel]);

    const [excludeData, setExcludeData] = useState<MaterialValueOrgModel[]>([]);

    useEffect(() => {
        if (props.valueSpec.length > 0) {
            let newArrValue: ReplacementDeviceModel[] = [];
            for (let i = 0; i < props.valueSpec.length; i++) {
                newArrValue = newArrValue.concat({replacementInDevice: props.valueSpec[i]} as ReplacementDeviceModel)
                form.setFieldsValue(
                    {
                        [i + 'replacementInDevice']: getDeviceName(props.valueSpec[i].materialValue)
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
                    const result: storageResult = await saveReplacementDevice(values) as storageResult;
                    if (result.isOk) {
                        storageLoadFromServer();
                        props.resetSelect();
                        props.closeDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        setValues([...values.concat({} as ReplacementDeviceModel)])
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: any) => {
            if (name==='replacementInDevice' && !isParent(value, storageList)){
                    setNotification({
                        type: "error",
                        message: "Ошибка",
                        description: "Необходимо выбрать кабинет"
                    })
                    form.resetFields([index + name]);
            }
            if (name==='replacementToDevice' && values[index].replacementInDevice.materialValue.materialValueType.name!==value.materialValue.materialValueType.name){
                setNotification({
                    type: "error",
                    message: "Ошибка",
                    description: "Необходимо выбрать оборудование того же типа"
                })
                form.resetFields([index + name]);
            }
            if (name==='replacementToDevice'  && isParent(value, storageList)){
                setNotification({
                    type: "error",
                    message: "Ошибка",
                    description: "Необходимо выбрать МЦ "
                })
                form.resetFields([index + name]);
            }
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

        const refreshField = (newArr: ReplacementDeviceModel[]) => {
            for (let i = 0; i < newArr.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'statement']: newArr[i].statement?.id,
                        [i + 'location']: newArr[i].location?.id,
                        [i + 'budgetAccount']: newArr[i].budgetAccount?.id,
                        [i + 'replacementInDevice']:getDeviceName(newArr[i].replacementInDevice?.materialValue),
                        [i + 'replacementToDevice']: getDeviceName(newArr[i].replacementToDevice?.materialValue),
                    }
                );
            }
        }

        return (
            <CardView typeModel={"ReplacementDeviceModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <ReasonSelect load={loadSelect} buttonAdd={true} name={index + 'statement'} reasonType={'statement'}
                                               rulesOn={false}
                                               onChange={(value) => changeField(index, "statement", value)}/>
                              <LocationTreeSelect load={loadSelect} buttonAdd={true} name={index + 'location'}
                                                  rulesOn={true}
                                                  locationType={'storage'}
                                                  onChange={(value) => changeField(index, "location", value)}/>
                              <BudgetAccountSelect load={loadSelect} buttonAdd={true} name={index + 'budgetAccount'}
                                                   rulesOn={true}
                                                   onChange={(value) => changeField(index, "budgetAccount", value)}/>
                              <MaterialValueOrgInput name={index + 'replacementInDevice'} rulesOn={true} label={'Заменить в'}
                                                     onChange={(value) => changeField(index, "replacementInDevice", value)}
                                                     typeUrl={'getAllMaterialValueOrgByAddOtherTrue'} excludeData={excludeData}/>
                              <MaterialValueOrgInput name={index + 'replacementToDevice'} rulesOn={true} label={'Заменить на'}
                                                     onChange={(value) => changeField(index, "replacementToDevice", value)}
                                                     typeUrl={'allDeviceStorage'} excludeData={excludeData}/>
                          </>}
            />
        )
    }

    const setExclude = () => {
        let tmp: MaterialValueOrgModel[] = []
        values.forEach((item) => {
            if (item.replacementInDevice !== undefined) {
                tmp = tmp.concat(item.replacementInDevice)
            }
            if (item.replacementToDevice !== undefined) {
                tmp = tmp.concat(item.replacementToDevice)
            }
        })
        setExcludeData(tmp)
    }

    return (
        <Drawer
            title={'Замена МЦ'}
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
        </Drawer>
    );
};

export default ReplacementDeviceDrawer;