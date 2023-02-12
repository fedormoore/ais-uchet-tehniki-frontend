import React, {FC, useEffect, useState} from 'react';
import {Button, Col, Drawer, Form, Input, Row, Space, Tabs, TabsProps} from "antd";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import {getDeviceName, isParent} from "../../../components/storage";
import {useActions} from "../../../hooks/useActions";
import {
    MaterialValueOrgActionCreators,
    storageResult
} from "../../../reducers/materialValueOrg/materialValueOrgActionCreators";
import LocationTreeSelect from "../../../components/ui/treeSelect/LocationTreeSelect";
import BudgetAccountSelect from "../../../components/ui/select/BudgetAccountSelect";
import UserSelect from "../../../components/ui/select/UserSelect";
import HistoryTab from "./HistoryTab";
import HistoryEdit from "./HistoryEdit";
import {MaterialValueOrgHistoryModel} from "../../../models/MaterialValueOrgHistoryModel";
import {Request} from "../../../http/network";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import ChildrenTab from "./ChildrenTab";
import {UrlEnum} from "../../../constants/urlEnum";

export type LocationType = 'storage' | 'cabinet';

interface MaterialValueOrgStorageEditProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    valueEdit: MaterialValueOrgModel;
    locationType: LocationType;
}

let valueHistoryEdit: MaterialValueOrgHistoryModel = {} as MaterialValueOrgHistoryModel;

const MaterialValueOrgEdit: FC<MaterialValueOrgStorageEditProps> = (props) => {

    const [form] = Form.useForm();
    const [valueEdit, setValueEdit] = useState<MaterialValueOrgModel>(props.valueEdit);
    const {
        storageList, registryList
    } = useTypedSelector(state => state.registry)
    const {
        saveMaterialValueOrg,
        cabinetLoadFromServer,
        storageLoadFromServer
    } = useActions(MaterialValueOrgActionCreators);

    const [valueHistoryList, setValueHistoryList] = useState<MaterialValueOrgHistoryModel[]>([]);
    const [visibleHistoryEdit, setVisibleHistoryEdit] = useState<boolean>(false);
    const [historyLoad, setHistoryLoad] = useState<boolean>(false);
    const [parent, setParent] = useState<boolean>(true);

    useEffect(() => {
        if (props.locationType === 'cabinet') {
            setParent(isParent(valueEdit, registryList));
        } else {
            setParent(isParent(valueEdit, storageList));
        }

        if (!valueEdit.materialValue.materialValueType.addOther) {
            onChange('2')
        }

        form.setFieldsValue(
            {
                'barcode': valueEdit.barcode,
                'user': valueEdit.user?.id,
                'location': valueEdit.location?.id,
                'budgetAccount': valueEdit.budgetAccount?.id,
                'responsible': valueEdit.responsible?.id,
                'invNumber': valueEdit.invNumber
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: storageResult = await saveMaterialValueOrg(valueEdit) as storageResult;
                    if (result.isOk) {
                        if (props.locationType === 'cabinet') {
                            cabinetLoadFromServer();
                        } else {
                            storageLoadFromServer();
                        }
                        props.closeDrawer();
                    }
                })();
            })
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Состав`,
            children: <ChildrenTab value={valueEdit}/>,
        },
        {
            key: '2',
            label: `История`,
            children: <HistoryTab historyEdit={(value) => {
                valueHistoryEdit = value;
                setVisibleHistoryEdit(true);
            }} loadValue={historyLoad} value={valueHistoryList}/>,
        }
    ];

    const materialValueOrgColumns = () => {

        const x = () => {
            let itemsTmp: TabsProps['items'] = items;
            if (!valueEdit.materialValue.materialValueType.addOther) {
                itemsTmp = itemsTmp.filter(item => item.key !== '1')
            }
            return itemsTmp;
        }

        return x();
    }

    const onChange = (key: string) => {
        if (key === '2' && valueHistoryList.length === 0) {
            loadHistory()
        }
    };

    const loadHistory = () => {
        setHistoryLoad(true);
        Request({
            url: UrlEnum.HistoryByRegistryId + valueEdit.id,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    setValueHistoryList(response.data)
                    setHistoryLoad(false);
                } else {

                }
            });
    }

    return (
        <>
            <Drawer
                style={{overflow: 'hidden'}}
                title={'Редактирование: ' + getDeviceName(props.valueEdit.materialValue)}
                width={'100%'}
                closable={false}
                open={props.openDrawer}
                getContainer={false}
                placement="right"
                extra={
                    <Space>
                        <Button onClick={props.closeDrawer}>Отмена</Button>
                        <Button type="primary" onClick={() => onClickSaveRecord()}>Сохранить</Button>
                    </Space>
                }
            >
                <Form form={form} layout="vertical" preserve={false}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                label="Штрихкод"
                                name={'barcode'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Пожалуйста укажите код'
                                    }
                                ]}
                            >
                                <Input
                                    onChange={e => setValueEdit({...valueEdit, barcode: e.target.value})}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <UserSelect load={true} buttonAdd={true} label={'Сотрудник'} name={'user'}
                                        rulesOn={false} enable={parent}
                                        onChange={(value) => setValueEdit({...valueEdit, user: value})}/>
                        </Col>
                        <Col span={8}>
                            <LocationTreeSelect load={true} buttonAdd={true} name={'location'} rulesOn={!parent}
                                                enable={parent}
                                                onChange={(value) => setValueEdit({...valueEdit, location: value!})}
                                                locationType={props.locationType}/>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <BudgetAccountSelect load={true} buttonAdd={true} name={'budgetAccount'} rulesOn={!parent}
                                                 onChange={(value) => setValueEdit({
                                                     ...valueEdit,
                                                     budgetAccount: value
                                                 })}/>
                        </Col>
                        <Col span={8}>
                            <UserSelect load={true} buttonAdd={true} label={'МОЛ'} name={'responsible'}
                                        rulesOn={false} enable={parent}
                                        onChange={(value) => setValueEdit({...valueEdit, responsible: value})}/>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Инвентарный номер"
                                name={'invNumber'}
                            >
                                <Input
                                    onChange={e => setValueEdit({...valueEdit, invNumber: e.target.value})}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Tabs type="card" defaultActiveKey="0" items={materialValueOrgColumns()} onChange={onChange}/>
            </Drawer>
            {visibleHistoryEdit &&
                <HistoryEdit openDrawer={visibleHistoryEdit} closeDrawer={() => {
                    setVisibleHistoryEdit(false);
                    loadHistory();
                }}
                             valueEdit={valueHistoryEdit}/>
            }
        </>
    );
};

export default MaterialValueOrgEdit;