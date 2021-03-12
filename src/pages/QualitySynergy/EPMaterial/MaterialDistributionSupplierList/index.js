import { useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, utils } from 'suid';
import { Input, Modal } from 'antd';
import { commonUrl } from '@/utils';
import { openNewTab, downloadBlobFile } from '@/utils';
import { AutoSizeLayout, Header, AdvancedForm, DataExportButton } from '@/components';
import {
  MaterialConfig,
  fillStatusList,
  findAllMaterialByPage as EXPORT_METHOD,
  checkReviewList,
  reviewResultsList,
  SourceTypeEnuList,
} from '../../commonProps';
import styles from './index.less';

const { recommendUrl } = commonUrl;
const { authAction } = utils;
const { Search } = Input;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const DOWNLOADNAME = '环保资料物料分配供应商明细表';
export default function () {
  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const [searchValue, setSearchValue] = useState({});

  // 高级查询配置
  const formItems = [
    { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
    { title: '供应商代码', key: 'supplierCode', props: { placeholder: '输入供应商代码' } },
    { title: '填报编号', key: 'fillNumber', props: { placeholder: '输入填报编号' } },
    { title: '复核状态', key: 'checkReview', type: 'list', props: checkReviewList },
    { title: '复核结果', key: 'reviewResults', type: 'list', props: reviewResultsList, },
    { title: '环保管理人员', key: 'environmentAdministratorName', props: { placeholder: '输入环保管理人员查询' } },
    { title: '填报状态', key: 'effectiveStatus', type: 'list', props: fillStatusList },
    { title: '来源', key: 'sourceType', type: 'list', props: SourceTypeEnuList },
  ];

  useEffect(() => {
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
  }, []);

  function listenerParentClose (event) {
    const { data = {} } = event;
    if (data.tabAction === 'close') {
      setSearchValue({});
      tableRef.current.remoteDataRefresh();
    }
  }

  // 导出
  function handleExport () {
    Modal.confirm({
      title: '导出数据',
      content: '是否导出当前查询条件下数据？',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const search = {
          ...searchValue,
          pageInfo: { page: 1, rows: 100000 },
        }
        const { success, message: msg, data } = await EXPORT_METHOD(search)
        if (success) {
          downloadBlobFile(data, DOWNLOADNAME);
          message.success('导出成功')
          return
        }
        message.error(msg)
      }
    })
  }

  const columns = [
    { title: '物料代码', dataIndex: 'materialCode', ellipsis: true },
    { title: '物料描述', dataIndex: 'materialName', ellipsis: true, width: 260, },
    { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true },
    { title: '供应商描述', dataIndex: 'supplierName', ellipsis: true, width: 240, },
    {
      title: '填报编号', dataIndex: 'fillNumber', ellipsis: true, width: 160,
      render: (text, item) => {
        return <a onClick={() => {
          openNewTab(`qualitySynergy/EPMaterial/suppliersFillForm?id=${item.id}&pageStatus=detail`, '环保资料填报-明细', false);
        }}>{text}</a>;
      },
      isDom: true,
    },
    {
      title: '复核状态', dataIndex: 'checkReview', ellipsis: true, render: (text) => text ? '复核' : '未复核'
    },
    {
      title: '复核结果', dataIndex: 'reviewResults', ellipsis: true, render: (text) => {
        switch (text) {
          case "NOPASS": return '不通过';
          case "PASS": return '通过';
          default: return '';
        }
      }
    },
    { title: '复核意见', dataIndex: 'reviewResultComments', ellipsis: true },
    { title: '是否需要填报', dataIndex: 'needToFill', width: 110, render: (text) => text ? '是' : '否' },
    {
      title: '填报状态', dataIndex: 'effectiveStatus', width: 80, render: (text) => {
        switch (text) {
          case 'NOTCOMPLETED':
            return '未填报';
          case 'COMPLETED':
            return '已填报';
          default:
            return '未填报';
        }
      },
    },
    {
      title: '符合性检查', dataIndex: 'compliance', ellipsis: true, align: 'center', render: (text) => {
        switch (text) {
          case 'FIT':
            return '符合';
          case 'NOTFIT':
            return '不符合';
          case "REVIEW_FIT":
            return '抽检不符合';
          default:
            return '';
        }
      },
    },
    {
      title: '环保资料是否有效', dataIndex: 'effective', ellipsis: true, render: (text) => {
        switch (text) {
          case "INVALID": return '无效';
          case "VALID": return '有效';
          default: return '';
        }
      }
    },
    { title: '剩余有效天数', dataIndex: 'daysRemaining', ellipsis: true },
    {
      title: '有效开始日期',
      dataIndex: 'effectiveStartDate',
      ellipsis: true,
      render: (text) => text ? text.slice(0, 10) : '',
    },
    { title: '有效截止日期', dataIndex: 'effectiveEndDate', ellipsis: true, render: (text) => text ? text.slice(0, 10) : '' },
    { title: '物料组', dataIndex: 'materialGroupCode', ellipsis: true },
    { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true },
    { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true },
    { title: '环保管理人员', dataIndex: 'environmentAdministratorName', ellipsis: true },
  ].map(item => ({ ...item, align: 'center' }))

  // 导出
  const explainResponse = res => {
    let arr = []
    res.data.rows.forEach(item => {
      let columnsObj = {};
      columns.forEach(columnsItem => {
        columnsObj[columnsItem.title] = columnsItem.render && !columnsItem.isDom ? columnsItem.render(item[columnsItem.dataIndex]) : item[columnsItem.dataIndex]
      })
      arr.push(columnsObj)
    });
    if (res.success) {
      return arr;
    }
    return [];
  };

  // 获取导出的数据
  const requestParams = {
    url: `${recommendUrl}/api/epDataFillService/findAllMaterialByPage`,
    data: {
      pageInfo: { page: 1, rows: 100000 },
    },
    method: 'POST',
  };

  const headerLeft = <>
    {
      authAction(<DataExportButton
        requestParams={requestParams}
        explainResponse={explainResponse}
        filenameFormat={DOWNLOADNAME}
        tableRef={tableRef}
        key='MATERIALDISTRIBUTIONSUPPLIERLIST_EXPORT'
        ignore={DEVELOPER_ENV}
      >
        导出
    </DataExportButton>)

    }
  </>;
  const headerRight = <>
    <Search
      placeholder='请输入物料代码、供应商代码或供应商名称查询'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </>;



  // 快捷查询
  function handleQuickSearch (value) {
    setSearchValue(v => ({ ...v, quickSearchValue: value }));
    refresh();
  }

  // 清空选中/刷新表格数据
  const refresh = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 处理高级搜索
  function handleAdvnacedSearch (value) {
    value.materialCode = value.materialCode_name;
    value.strategicPurchaseCode = value.strategicPurchaseCode_name;
    delete value.materialCode_name;
    delete value.reviewResults_name;
    delete value.sourceType_name;
    delete value.effectiveStatus_name;
    delete value.checkReview_name;

    if (JSON.stringify(value) == '{}') {
      setSearchValue(v => ({ quickSearchValue: v.quickSearchValue || '' }));
    } else {
      setSearchValue(v => ({ ...v, ...value }));
    }

    refresh();
    headerRef.current.hide();
  }

  return <Fragment>
    <Header
      left={headerLeft}
      right={headerRight}
      ref={headerRef}
      content={
        <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch} />
      }
      advanced
    />
    <AutoSizeLayout>
      {
        (h) => <ExtTable
          columns={columns}
          bordered
          height={h}
          allowCancelSelect
          remotePaging
          checkbox={{ multiSelect: true }}
          ref={tableRef}
          rowKey={(item) => item.id}
          showSearch={false}
          store={{
            url: `${recommendUrl}/api/epDataFillService/findAllMaterialByPage`,
            params: {
              ...searchValue,
              quickSearchProperties: [],
            },
            type: 'POST',
          }}
          checkbox={false}
        />
      }
    </AutoSizeLayout>
  </Fragment>;
};
