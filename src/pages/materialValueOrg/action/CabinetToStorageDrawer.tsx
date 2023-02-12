import React, {FC, useEffect, useState} from 'react';
import {Button, Col, Drawer, Form, Layout, Row, Space} from "antd";
import {useActions} from "../../../hooks/useActions";
import {RegistryToStorageModel} from "../../../models/registy/action/RegistryToStorageModel";
import LocationTreeSelect from "../../../components/ui/treeSelect/LocationTreeSelect";
import {
    MaterialValueOrgActionCreators,
    storageResult
} from "../../../reducers/materialValueOrg/materialValueOrgActionCreators";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import {getDeviceName} from "../../../components/storage";
import CardView from "./CardView";
import ReasonSelect from "../../../components/ui/select/ReasonSelect";
import MaterialValueOrgInput from "../../../components/ui/input/MaterialValueOrgInput";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";

interface RegistryToStorageDrawerProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    materialValueOrgList: null | MaterialValueOrgModel[];
    resetSelect: () => void;
}

const CabinetToStorageDrawer: FC<RegistryToStorageDrawerProps> = (props) => {

    const [form] = Form.useForm();
    const {setNotification} = useActions(AppActionCreators);
    const {
        saveCabinetToStorage, storageLoadFromServer,
        cabinetLoadFromServer
    } = useActions(MaterialValueOrgActionCreators);

    const [values, setValues] = useState<RegistryToStorageModel[]>([{} as RegistryToStorageModel]);

    useEffect(() => {
        if (props.materialValueOrgList!.length > 0) {
            let newArrValue: RegistryToStorageModel[] = [];
            for (let i = 0; i < props.materialValueOrgList!.length; i++) {
                newArrValue = newArrValue.concat({materialValueOrg: props.materialValueOrgList![i]} as RegistryToStorageModel)
                form.setFieldsValue(
                    {
                        [i + 'materialValueOrg']: getDeviceName(props.materialValueOrgList![i].materialValue)
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
                    const result: storageResult = await saveCabinetToStorage(values) as storageResult;
                    if (result.isOk) {
                        storageLoadFromServer();
                        cabinetLoadFromServer();
                        props.resetSelect();
                        props.closeDrawer();
                    }
                })();
            })
    }

    const onClickAddField = () => {
        setValues([...values.concat({} as RegistryToStorageModel)])
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: any) => {
            values[index] = {...values[index], [name]: value};
            setValues([...values])
            if (name === 'materialValueOrg') {
                refreshField(values)
            }
            if (name === 'location' && value.type !== 'Склад') {
                setNotification({
                    type: "error",
                    message: "Ошибка",
                    description: "Необходимо выбрать склад"
                })
                form.resetFields([index + name]);
            }
        }

        const removeField = (event: any, index: number) => {
            event.stopPropagation()
            values.splice(index, 1);
            setValues([...values])
            refreshField(values);
        }

        const refreshField = (newArr: RegistryToStorageModel[]) => {
            for (let i = 0; i < newArr.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'statement']: newArr[i].statement?.id,
                        [i + 'materialValueOrg']: getDeviceName(newArr[i].materialValueOrg?.materialValue),
                        [i + 'location']: newArr[i].location?.id
                    }
                );
            }
        }

        return (
            <CardView typeModel={"RegistryToStorageModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <ReasonSelect load={true} buttonAdd={true} name={'statement'} rulesOn={false}
                                            onChange={(value) => changeField(index, 'statement', value)}
                                            reasonType={'statement'}/>
                              <MaterialValueOrgInput name={index + 'materialValueOrg'} rulesOn={true}
                                                     selectChildren={false}
                                                     excludeData={values.map((item) => {
                                                         if (item.materialValueOrg !== undefined) {
                                                             return item.materialValueOrg
                                                         } else {
                                                             return {} as MaterialValueOrgModel
                                                         }
                                                     })}
                                                     typeUrl={'getAllMaterialValueOrgParentIsNull'}
                                                     label={'Материальная ценность'}
                                                     onChange={(value) => changeField(index, 'materialValueOrg', value)}/>
                              <Row gutter={24}>
                                  <Col span={24}>
                                      <LocationTreeSelect load={loadSelect} buttonAdd={true}
                                                          name={index + 'location'}
                                                          rulesOn={true}
                                                          locationType={'storage'}
                                                          onChange={(value) => changeField(index, 'location', value)}/>
                                  </Col>
                              </Row>
                          </>}
            />
        )
    }

    return (
        <Drawer
            title={'Выдать'}
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

export default CabinetToStorageDrawer;