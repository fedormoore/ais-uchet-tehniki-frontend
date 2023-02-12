import React, {useEffect, useState} from 'react';
import {Request} from "../http/network";
import {UrlEnum} from "../constants/urlEnum";
import {AccountSettingModel} from "../models/AccountSetting";
import {Button, Input} from "antd";

const { TextArea } = Input;

const AccountSetting = () => {

    const [value, setValue] = useState<AccountSettingModel>({} as AccountSettingModel);

    useEffect(() => {
        Request({
            url: UrlEnum.AccountSetting,
            method: "GET"
        })
            .then((response: any) => {
                if (response.isOk) {
                    setValue(response.data);
                } else {

                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const x = () => {
        Request({
            url: UrlEnum.AccountSetting,
            method: "POST",
            body: JSON.stringify(value),
        })
            .then((response: any) => {

            });
    }

    return (
        <div>
            <TextArea value={value.preambleStatementReport} onChange={(e)=>setValue({...value, preambleStatementReport:e.target.value})}/>
            <Button onClick={()=>x()}>Сохранить</Button>
        </div>
    );
};

export default AccountSetting;