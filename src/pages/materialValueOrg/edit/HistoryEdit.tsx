import React, {FC, useEffect, useState} from 'react';
import {Button, Col, Drawer, Form, Row, Space} from "antd";
import {HistoryEditSendModel, MaterialValueOrgHistoryModel} from "../../../models/MaterialValueOrgHistoryModel";
import {Request} from "../../../http/network";
import {HistoryToServerSave} from "../../../dataPreparation/toServer/hitoryToServer";
import ReasonSelect from "../../../components/ui/select/ReasonSelect";
import {UrlEnum} from "../../../constants/urlEnum";
import {useActions} from "../../../hooks/useActions";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";

interface HistoryEditProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    valueEdit: MaterialValueOrgHistoryModel;
}

const HistoryEdit: FC<HistoryEditProps> = (props) => {

    const {modalWait} = useActions(AppActionCreators);
    const [form] = Form.useForm();
    const [value, setValue] = useState<MaterialValueOrgHistoryModel>(props.valueEdit);

    useEffect(() => {
        form.setFieldsValue(
            {
                'statement': value.reason!.id,
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                modalWait({visible: true, message: "Сохранение данных..."})
                let saveHistory: HistoryEditSendModel = HistoryToServerSave(value);

                Request({
                    url: UrlEnum.History,
                    method: "POST",
                    body: JSON.stringify([saveHistory]),
                })
                    .then((response: any) => {
                        if (response.isOk) {
                            props.closeDrawer();
                            modalWait({visible: false, message: ""})
                        } else {

                        }
                    });
            })
    }

    return (
        <Drawer
            title={'Редактирование'}
            width={'400px'}
            closable={false}
            open={props.openDrawer}
            getContainer={false}
            extra={
                <Space>
                    <Button onClick={props.closeDrawer}>Отмена</Button>
                    <Button type="primary" onClick={() => onClickSaveRecord()}>Сохранить</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" preserve={false}>
                <Row gutter={24}>
                    <Col span={24}>
                        <ReasonSelect load={true} buttonAdd={true} name={'statement'} rulesOn={false}
                                      reasonType={props.valueEdit.type === 'Поступление' ? 'contract' : 'statement'}
                                      onChange={(valueStatement) => setValue({...value, reason: valueStatement})}/>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default HistoryEdit;