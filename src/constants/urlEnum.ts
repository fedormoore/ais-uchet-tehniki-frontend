export enum UrlEnum {

    // Server = "http://localhost:8080",
    Server = "",
    VerApi = "/api/v1",

    AccountSetting = '/app/account_setting',

    // URL ДЛЯ СПРАВОЧНИКОВ
    // URL ДЛЯ СОТРУДНИКОВ
    UserPage = '/app/spr_user',
    UserList = '/app/spr_user/list',

    // URL ДЛЯ ОРГАНИЗАЦИИ И ОТДЕЛОВ
    OrganizationPage = '/app/spr_organization',
    OrganizationTypeList = '/app/spr_organization/type_list',
    OrganizationOnlyOrgList = '/app/spr_organization/only_org_list',
    OrganizationOnlyStrList = '/app/spr_organization/only_str_list',

    // URL ДЛЯ КАБИНЕТОВ И СКЛАДОВ
    LocationPage = '/app/spr_location',
    LocationTypeList = '/app/spr_location/type_list',
    LocationOnlyStorageList = '/app/spr_location/only_storage_list',
    LocationOnlyCabinetList = '/app/spr_location/only_cabinet_list',

    // URL ДЛЯ ТИП МАТЕРИАЛЬНЫХ ЦЕННОСТЕЙ
    MaterialValueTypePage = '/app/spr_material_value_type',
    MaterialValueTypeList = '/app/spr_material_value_type/list',

    // URL ДЛЯ МАТЕРИАЛЬНЫХ ЦЕННОСТЕЙ
    MaterialValuePage = '/app/spr_material_value',
    MaterialValueList = '/app/spr_material_value/list',
    MaterialValueNameInOrgIsNotNullList = '/app/spr_material_value/name_in_org_is_not_null_list',
    MaterialValueByAddToOtherTrueList = '/app/spr_material_value/material_value_by_add_to_other_true_list',
    MaterialValueFirmList = '/app/spr_material_value/firm_list',

    // URL ДЛЯ КОНТРАГЕНТОВ
    CounterpartyPage = '/app/spr_counterparty',
    CounterpartyList = '/app/spr_counterparty/list',

    // URL ДЛЯ УЧЕТНЫХ СЧЕТОВ
    BudgetAccountPage = '/app/spr_budget_account',
    BudgetAccountList = '/app/spr_budget_account/list',

    // URL ДЛЯ ОСНОВАНИЯ
    Reason = '/app/reason',
    ReasonContractPage = '/app/reason/contract',
    ReasonStatementPage = '/app/reason/statement',
    ReasonContractList = '/app/reason/contract_list',
    ReasonStatementList = '/app/reason/statement_list',

    ReasonSpecContractByReasonId = '/app/device_history/contract/',
    ReasonSpecContract = '/app/device_history/contract',
    ReasonSpecStatementByReasonId = '/app/device_history/statement/',
    ReasonSpecStatement = '/app/device_history/statement',

    // URL ДЛЯ ИСТОРИИ
    History = '/app/device_history',
    HistoryByRegistryId = '/app/device_history/registry/',
    HistoryByReasonId = '/app/device_history/reason/',

    // URL ДЛЯ МАТЕРИАЛЬНЫХ ЦЕННОСТЕЙ В ОРГАНИЗАЦИИ
    MaterialValueOrgCabinetPage = '/app/material_value_org/cabinet',
    MaterialValueOrgStoragePage = '/app/material_value_org/storage',
    MaterialValueOrgSave = '/app/material_value_org',

    // URL ДЛЯ ИЗМЕНЕНИЯ МАТЕРИАЛЬНЫХ ЦЕННОСТЕЙ В ОРГАНИЗАЦИИ
    MaterialValueOrgIncome = '/app/material_value_org/income',
    MaterialValueOrgAssemble = '/app/material_value_org/assemble',
    MaterialValueOrgDisassemble = '/app/material_value_org/disassemble',
    MaterialValueOrgAdd = '/app/material_value_org/add_device',
    MaterialValueOrgRemove = '/app/material_value_org/remove_device',
    MaterialValueOrgReplacement = '/app/material_value_org/replacement',
    MaterialValueOrgRepair = '/app/material_value_org/repair',
    MaterialValueOrgRepairCartridge = '/app/material_value_org/replacement_cartridge',
    MaterialValueOrgRefillingCartridge = '/app/material_value_org/refilling_cartridge',
    MaterialValueOrgWriteOff = '/app/material_value_org/write_off',
    MaterialValueOrgDisposeOf = '/app/material_value_org/dispose_of',
    MaterialValueOrgStorageToCabinet = '/app/material_value_org/storage_to_cabinet',
    MaterialValueOrgCabinetToStorage = '/app/material_value_org/cabinet_to_storage',

    // URL ДЛЯ ОТЧЕТОВ
    ReportGenerateBarcode = '/app/report/generate_barcode',
    ReportHistory = '/app/report/history',
    ReportUserToLocation = '/app/report/user_to_location',
    ReportMaterialValueOrgToLocation = '/app/report/material_value_org_to_location',
    ReportStatusCartridge = '/app/report/status_cartridge',
    ReportContract = '/app/report/contract',
    ReportStatement = '/app/report/statement',

    SprAllMaterialValueOrgNotExpandable = '/app/material_value_org/all_material_value_org_not_expandable',
    SprAllMaterialValueOrgParentIsNull = '/app/material_value_org/all_material_value_org_parent_is_null',
    getAllMaterialValueOrgChildrenIsNull = '/app/material_value_org/all_material_value_org_children_is_null',
    SprAllMaterialValueOrgNameInOrgIsNotNull = '/app/material_value_org/all_material_value_org_name_in_org_is_not_null',
    SprAllMaterialValueOrgByAddToOtherTrueAndParentIsNull = '/app/material_value_org/all_material_value_org_by_add_to_other_true_and_paren_is_null',
    SprAllMaterialValueOrgByAddOtherTrue = '/app/material_value_org/all_material_value_org_by_add_other_true',

    SprAllPrinterInCabinet = '/app/material_value_org/printer_in_cabinet_list',
    SprAllCartridgeFull = '/app/material_value_org/cartridge_full_list',
    SprAllCartridgeNeedRefilling = '/app/material_value_org/cartridge_need_refilling_list',
}