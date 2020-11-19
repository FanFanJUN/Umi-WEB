/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 13:47:57
 * @LastEditTime: 2020-09-23 13:52:30
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/MproCertification.js
 * @Description: 管理体系及产品认证
 * @Connect: 1981824361@qq.com
 */
import { useState, useRef, Fragment, useEffect } from 'react';
import { Divider } from 'antd';
import moment from 'moment';
import EditableFormTable from '../CommonUtil/EditTable';

const MproCertification = ({ type, data, setTableData }) => {
  const { productCertifications, otherCertifications } = data;
  const [proData, setProData] = useState([]);
  const [otherData, setOtherData] = useState([]);

  const tableRef = useRef(null);

  const columnsForMan = [
    {
      title: '管理体系',
      dataIndex: 'certificateName',
      ellipsis: true,
    },
    {
      title: '认证类型',
      dataIndex: 'certificateInfoType',
      ellipsis: true,
      editable: true
    },
    {
      title: '执行标准',
      dataIndex: 'executiveStandard',
      ellipsis: true,
    },
    {
      title: '证照编号',
      dataIndex: 'certificateNumber',
      ellipsis: true,
    },
    {
      title: '发证机构',
      dataIndex: 'certifyingAuthority',
      ellipsis: true,
    },
    {

      title: '首次获证时间',
      dataIndex: 'firstObtainTime',
      ellipsis: true,
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD');
      },
      width: 150
    },
    {
      title: '有效期间',
      dataIndex: 'validDate',
      ellipsis: true,
    },
    {
      title: '附件',
      dataIndex: 'attachmentId',
      ellipsis: true,
    },
    {

      title: '计划取得时间',
      dataIndex: 'planObtainTime',
      ellipsis: true,
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD');
      },
      width: 150
    },
  ].map(item => ({
    ...item,
    align: 'center'
  }));

  const columnsForPro = [
    {
      title: '产品',
      dataIndex: 'productName',
      ellipsis: true,
      editable: false
    },
    {
      title: '认证类型',
      dataIndex: 'certificateInfoType',
      ellipsis: true,
      editable: true,
      inputDisabled: true,
      inputDefaultValue: 'PRODUCT_CERTIFICATION',
      inputType: 'Select',
      selectOptions: [
        {
          name: '管理体系',
          value: 'MANAGEMENT_SYSTEM'
        },
        {
          name: '产品认证',
          value: 'PRODUCT_CERTIFICATION'
        },
        {
          name: '其他认证',
          value: 'OTHER_CERTIFICATION'
        },
      ]
    },
    {
      title: '执行标准',
      dataIndex: 'executiveStandard',
      ellipsis: true,
      editable: true
    },
    {
      title: '证照编号',
      dataIndex: 'certificateNumber',
      ellipsis: true,
      editable: true
    },
    {
      title: '发证机构',
      dataIndex: 'certifyingAuthority',
      ellipsis: true,
      editable: true
    },
    {
      title: '首次获证时间',
      dataIndex: 'firstObtainTime',
      ellipsis: true,
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD');
      },
      inputType: 'DatePicker',
      editable: true
    },
    {
      title: '最新年审',
      dataIndex: 'newestAnnualReview',
      ellipsis: true,
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD');
      },
      inputType: 'DatePicker',
      editable: true
    },
    {
      title: '附件',
      dataIndex: 'attachmentIds',
      ellipsis: true,
      editable: true,
      inputType: 'UploadFile'
    },
    {

      title: '计划取得时间',
      dataIndex: 'planObtainTime',
      ellipsis: true,
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD');
      },
      inputType: 'DatePicker',
      editable: true
    },
  ].map(item => ({
    ...item,
    align: 'center'
  }));

  const columnsForOther = [
    {
      title: '产品',
      dataIndex: 'productName',
      ellipsis: true,
      editable: true
    },
    {
      title: '认证类型',
      dataIndex: 'certificateInfoType',
      ellipsis: true,
      editable: true,
      inputDisabled: true,
      inputDefaultValue: 'OTHER_CERTIFICATION',
      inputType: 'Select',
      selectOptions: [
        {
          name: '管理体系',
          value: 'MANAGEMENT_SYSTEM'
        },
        {
          name: '产品认证',
          value: 'PRODUCT_CERTIFICATION'
        },
        {
          name: '其他认证',
          value: 'OTHER_CERTIFICATION'
        },
      ]
    },
    {
      title: '执行标准',
      dataIndex: 'executiveStandard',
      ellipsis: true,
      editable: true
    },
    {
      title: '证照编号',
      dataIndex: 'certificateNumber',
      ellipsis: true,
      editable: true
    },
    {
      title: '发证机构',
      dataIndex: 'certifyingAuthority',
      ellipsis: true,
      editable: true
    },
    {

      title: '首次获证时间',
      dataIndex: 'firstObtainTime',
      ellipsis: true,
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD');
      },
      inputType: 'DatePicker',
      editable: true,
      width: 150
    },
    {
      title: '最新年审',
      dataIndex: 'newestAnnualReview',
      ellipsis: true,
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD')
      },
      inputType: 'DatePicker',
      editable: true
    },
    {
      title: '附件',
      dataIndex: 'attachmentIds',
      ellipsis: true,
      editable: true,
      inputType: 'UploadFile'
    },
    {

      title: '计划取得时间',
      dataIndex: 'planObtainTime',
      ellipsis: true,
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD');
      },
      inputType: 'DatePicker',
      editable: true, width: 150
    },
  ].map(item => ({ ...item, align: 'center' }));

  function setProNewData(newData) {
    setProData(newData);
    setTableData(newData, 'pro');
  }

  function setOtherNewData(newData) {
    setOtherData(newData);
    setTableData(newData, 'other');
  }

  useEffect(() => {
    if (!otherCertifications || !productCertifications) return
    const o = otherCertifications.map(item => ({
      ...item,
      guid: item?.id
    }))
    const p = productCertifications.map(item => ({
      ...item,
      guid: item?.id
    }))
    setOtherData(o)
    setProData(p)
  }, [productCertifications, otherCertifications])
  return <Fragment>
    <div>
      <Divider orientation='left'>管理体系</Divider>
      <EditableFormTable
        columns={columnsForMan}
        bordered
        allowCancelSelect
        showSearch={false}
        remotePaging
        rowKey={(item) => item.id}
        size='small'
      />
      <Divider orientation='left'>产品认证</Divider>
      <EditableFormTable
        columns={columnsForPro}
        copyLine={true}
        bordered
        allowCancelSelect
        showSearch={false}
        remotePaging
        rowKey='guid'
        size='small'
        isEditTable
        isToolBar={type === 'add'}
        setNewData={setProNewData}
        dataSource={proData || []}
      />
      <Divider orientation='left'>其他认证</Divider>
      <EditableFormTable
        columns={columnsForOther}
        bordered
        allowCancelSelect
        showSearch={false}
        remotePaging
        rowKey='guid'
        size='small'
        isEditTable
        isToolBar={type === 'add'}
        dataSource={otherData || []}
        setNewData={setOtherNewData}
      />
    </div>
  </Fragment>
}

export default MproCertification;