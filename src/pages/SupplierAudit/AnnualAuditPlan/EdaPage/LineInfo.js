/*
 * @Author: Li Cai
 * @LastEditors  : LiCai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:54
 * @LastEditTime : 2020-12-30 15:35:06
 * @Description: 行信息
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/LineInfo.js
 */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form, Button, message, Modal } from 'antd';
import { ExtTable } from 'suid';
import AddModal from './AddModal';
import BatchEditModal from './BatchEditModal';
import { isEmptyArray, isEmptyObject } from '../../../../utils/utilTool';
import moment from 'moment';
import { reviewTypesProps } from '../propsParams';
import { GetSupplierAreaByCode, GetSupplierContact } from '../../mainData/commomService';
import BatchImport from '../BatchImport';
import { smBaseUrl, recommendUrl } from '@/utils/commonUrl';
import _ from 'lodash';
import { BASE_URL } from '@/utils/constants';

const { confirm } = Modal;
let LineInfo = (props, ref) => {

  const { originData, type, isView, reviewType, deleteLine } = props;
  const tableRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getTableList: () => dataSource,
  }));

  const [data, setData] = useState({
    type: 'add',
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: ''
  });

  const [dataSource, setDataSource] = useState([]);
  const [batchEditVisible, setBatchEditVisible] = useState(false);
  const [selectData, setSelectData] = useState({});

  useEffect(() => {
    if (originData && !isEmptyArray(originData.planYearLineVos)) {
      setDataSource(originData.planYearLineVos)
    }
  }, [originData])

  const columns = [
    {
      title: '行号',
      dataIndex: 'reviewPlanYearLinenum',
      width: 80,
      ellipsis: true,
      align: 'center'
    },
    {
      title: '需求公司',
      dataIndex: 'applyCorporation',
      width: 140,
      ellipsis: true,
      render: (text, record) => {
        return record.applyCorporationCode && `${record.applyCorporationCode}_${record.applyCorporationName}`;
      },
    },
    {
      title: '采购组织',
      dataIndex: 'purchaseTeam',
      ellipsis: true,
      width: 140,
      render: (text, record) => {
        return record.purchaseTeamCode && `${record.purchaseTeamCode}_${record.purchaseTeamName}`;
      },
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      ellipsis: true,
      width: 140,
      render: (text, record) => {
        if(record.agentCode && record.supplierCode) {
          return record.agentCode && `${record.agentCode}_${record.agentName}`
        }
        return record.supplierCode && `${record.supplierCode}_${record.supplierName}`;
      },
    },
    {
      title: '代理商',
      dataIndex: 'agent',
      ellipsis: true,
      width: 140,
      render: (text, record) => {
        if(record.agentCode && record.supplierCode) {
          return `${record.supplierCode}_${record.supplierName}`
        }
        return record.agentCode && `${record.agentCode}_${record.agentName}`;
      },
    },
    {
      title: '物料分类',
      dataIndex: 'materialGroup',
      ellipsis: true,
      width: 140,
      render: (text, record) => {
        return record.materialGroupCode && `${record.materialGroupCode}_${record.materialGroupName}`;
      },
    },
    {
      title: '物料级别',
      dataIndex: 'materialGradeName',
      ellipsis: true,
      width: 80,
      align: 'center',
    },
    {
      title: '生产厂地址',
      dataIndex: 'address',
      ellipsis: true,
      width: 200,
      render: (v, data) => {
        return (
          `${data.countryName +
            data.provinceName +
            data.cityName +
            data.countyName +
            data.address}`.replace(/\s+/g, '')
        );
      },
    },
    {
      title: '供应商联系人',
      dataIndex: 'contactUserName',
      ellipsis: true,
      width: 140,
      align: 'center',
    },
    {
      title: '供应商联系电话',
      dataIndex: 'contactUserTel',
      ellipsis: true,
      width: 140,
      align: 'center',
    },
    { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 80 },
    { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 140 },
    { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 80 },
    {
      title: '预计审核月度',
      dataIndex: 'reviewMonth',
      ellipsis: true,
      width: 103,
      render: text => text && moment(text).format('YYYY-MM'),
      align: 'center',
    },
    { title: '专业组', dataIndex: 'specialtyTeamName', ellipsis: true, width: 140 },
    { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
  ];

  const handleBtn = (type) => {
    switch (type) {
      case 'add':
        return setData(v => ({ ...v, visible: true, title: '从合格供应商名录新增', type: 'add' }));
      case 'delete':
        confirm({
          title: '确定删除已选择行数据?',
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          onOk() {
            filterSelectRow();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      case 'edit':
        if (data && data.selectRows && data.selectRows.length > 1) {
          setSelectData({});
        } else {
          setSelectData(data.selectRows[0]);
        }
        setBatchEditVisible(true);
        break;
      default:
        break;
    }
  }

  function filterSelectRow() {
    let deleteData = JSON.parse(JSON.stringify(data.selectRows));
    let arr = JSON.parse(JSON.stringify(deleteLine));
    deleteData.forEach(item => {
      if (item.id) {
        item.whetherDelete = true;
        arr.push(item);
      }
    })

    let newDataSource = JSON.parse(JSON.stringify(dataSource));
    for (let index = newDataSource.length - 1; index >= 0; index--) {
      if ((data.selectedRowKeys).includes(newDataSource[index].reviewPlanYearLinenum)) {
        newDataSource.splice(index, 1);
      }
    }
    // 行号重新赋值
    newDataSource.forEach((item, index) => {
      item.reviewPlanYearLinenum = ((Array(4).join(0) + (index + 1)).slice(-4) + '0');
    })
    setDataSource(newDataSource);
    props.callbackSetDeleteLine(arr);
    clearSelect();
  }

  function clearSelect() {
    setData(v => ({ selectedRowKeys: [], selectRows: [] }));
  }

  const handleSelectedRows = (value, rows) => {
    setData((v) => ({ selectedRowKeys: value, selectRows: rows, type: 'add' }))
  }

  function setVisible() {
    setData(() => ({ visible: false, selectRows: [], selectedRowKeys: [] }));
  }

  // 获取供应商联系人
  function getSupplierContact(id){
     let res = {};
     GetSupplierContact({
       supplierId: id,
     }).then(res => {
       res = (res.data && res.data[0]) || {};
     });
     return res;
  };

  async function handleOk(tableData, buttonFlag) {
    console.log(tableData);
    // 获取供应商 生产厂地址
    let originSupplierCodeList = [];

    tableData.forEach(item => {
      if (item.supplier && item.originSupplierCode) {
        originSupplierCodeList.push(item.originSupplierCode);
      }
    });
    // 去重
    const finnalCode = [...new Set(originSupplierCodeList)];
    let resoriginSupplierList = [];
    if(!isEmptyArray(finnalCode)) {
      const requestPromise = finnalCode.map(item => {
        return GetSupplierAreaByCode({ code: item });
      });
      try {
        const res = await Promise.all(requestPromise);
        if (!isEmptyArray(res)) {
          resoriginSupplierList = res.map(item => ({
            code: item.data.code,
            supplierExtend: item.data.supplierExtend,
          }));
        }
      } catch (error) {
      }
    }
    
    tableData.forEach( (item) => {
      // 需求公司
      item.applyCorporationCode = item.corporation.code;
      item.applyCorporationId = item.corporation.id;
      item.applyCorporationName = item.corporation.name;
      // 采购组织=>占用采购组字段 数据库设计错误
      item.purchaseTeamCode = item.purchaseOrg.code;
      item.purchaseTeamName = item.purchaseOrg.name;
      item.purchaseTeamId = item.purchaseOrg.id;
      /* 则将原厂和供应商的信息互换，即原厂改为供应商，供应商改为代理商 */
      if (item.supplier && item.originSupplierCode) {
        // 供应商
        item.supplierCode = item.originSupplierCode;
        item.supplierName = item.originSupplierName;
        //代理商
        item.agentCode = item.supplier.code;
        item.agentName = item.supplier.name;
        item.agentId = item.supplier.id;
        // 地址
        if(!isEmptyArray(resoriginSupplierList)) {
          const supplierExtendList = resoriginSupplierList.map(originItem => {
            if (item.originSupplierCode === originItem.code) {
              return originItem.supplierExtend;
            }
          });
          const supplierExtend = supplierExtendList[0] || {};
          item.countryId = supplierExtend.countryId || '';
          item.countryName = supplierExtend.countryName || '';
          item.provinceId = supplierExtend.officeProvinceId || '';
          item.provinceName = supplierExtend.officeProvinceName || '';
          item.cityId = supplierExtend.officeRegionId || '';
          item.cityName = supplierExtend.officeRegionName || '';
          item.countyId = supplierExtend.officeDistrictId || '';
          item.countyName = supplierExtend.officeDistrictName || '';
          item.address = supplierExtend.officeStreet || '';
        }
      } else {
        // 供应商
        item.supplierCode = item.supplier.code;
        item.supplierName = item.supplier.name;
        item.supplierId = item.supplier.id;

        //代理商
        item.agentCode = item.originSupplierCode;
        item.agentName = item.originSupplierName;
        //地址
        const  supplierExtend  = item?.supplier?.supplierExtend;
        item.countryId = supplierExtend?.countryId || '';
        item.countryName = supplierExtend?.countryName || '';
        item.provinceId = supplierExtend?.officeProvinceId || '';
        item.provinceName = supplierExtend?.officeProvinceName || '';
        item.cityId = supplierExtend?.officeRegionId || '';
        item.cityName = supplierExtend?.officeRegionName || '';
        item.countyId = supplierExtend?.officeDistrictId || '';
        item.countyName = supplierExtend?.officeDistrictName || '';
        item.address = supplierExtend?.officeStreet || '';
      }
      // 物料分类
      item.materialGroupCode = item.materielCategory.code;
      item.materialGroupId = item.materielCategory.id;
      item.materialGroupName = item.materielCategory.name;

      // 物料级别
      item.materialGradeCode = item.materialGrade;
      item.materialGradeName = item.materialGrade;
      // 专业组
      item.specialtyTeamName = item.purchaseProfessionalGroup;
      // 默认审核类型
      item.reviewTypeName = reviewType.name;
      item.reviewTypeId = reviewType.id;
      item.reviewTypeCode = reviewType.code;
      // 选择数据ID
      item.rowId = item.id;
    })
    // 联系方式
    for ( let i=0; i<tableData.length; i++ ) {
      　//await的必须是个Promise
        await GetSupplierContact({
          supplierId: tableData[i].supplier.id,
        }).then((res)=>{
          console.log(res);
          const contractObj = res.data && !isEmptyArray(res.data) && res.data[0];
          tableData[i].contactUserName = contractObj.name;
          tableData[i].contactUserTel = contractObj.mobile;
        });
      }
    let newTableList = JSON.parse(JSON.stringify(dataSource));
    // 是否选择有重复数据 以需求公司、采购组织、供应商、物料分类、物料级别 判断唯一性
    const chooseDataKeys = tableData.map(
      item =>
        `${item.applyCorporationCode}${item.purchaseTeamCode}${item.materialGroupCode}${item.supplierCode}${item.materialGradeCode}${item.agentCode}`,
    );
    let checkFlag = false;
    if (!isEmptyArray(newTableList)) {
      const originDataKeys = newTableList.map(
        item =>
          `${item.applyCorporationCode}${item.purchaseTeamCode}${item.materialGroupCode}${item.supplierCode}${item.materialGradeCode}${item.agentCode}`,
      );
      for (let item of originDataKeys) {
        if (chooseDataKeys.includes(item)) {
          message.error('不能添加重复数据!');
          checkFlag = true;
          break;
        }
      }
    }
    if (checkFlag) {
      return;
    }
    newTableList.push(...tableData);
    // 行号
    newTableList.forEach((item, index) => {
      item.reviewPlanYearLinenum = ((Array(4).join(0) + (index + 1)).slice(-4) + '0');
    })
    setDataSource(newTableList);
    if (buttonFlag === 'continue') {
      message.info('数据添加成功！请继续')
      return;
    }
    setData((v) => ({ ...v, visible: false }));
  }

  function setBatchVisible() {
    setBatchEditVisible(false);
    clearSelect();
  }

  function getBatchFormValue(formValue) {
    const newDataSource = JSON.parse(JSON.stringify(dataSource));
    const newList = newDataSource.map(item => {
      if (data.selectedRowKeys.includes(item.reviewPlanYearLinenum)) {
        return { ...item, ...formValue };
      }
      return item;
    });
    setDataSource(newList);
    setBatchVisible();
    tableRef.current.manualSelectedRows();
  }

  function dealDataSource() {
    let copyDataSource = _.cloneDeep(dataSource);
    copyDataSource.forEach((item)=> {
      item.purchaseTeamName = `${item.purchaseTeamCode}_${item.purchaseTeamName}`;
      item.supplierName = `${item.supplierCode}_${item.supplierName}`;
      item.agentName = item.agentCode && `${item.agentCode}_${item.agentName}`;
      item.materialGroupName = `${item.materialGroupCode}_${item.materialGroupName}`;
    })
    return copyDataSource;
  }

  function importCallBack(data) {
    if (!isEmptyArray(data)) {
      let copyDataSource = _.cloneDeep(dataSource);
      copyDataSource.forEach(item => {
        data.forEach(record => {
          if(item.reviewPlanYearLinenum === record.reviewPlanYearLinenum) {
            item.countryId = record?.countryId || '';
            item.countryName = record?.countryName || '';
            item.countryCode = record?.countryCode || ''
            item.provinceId = record?.provinceId || '';
            item.provinceName = record?.provinceName || '';
            item.provinceCode = record?.provinceCode || ''
            item.cityId = record?.cityId || '';
            item.cityName = record?.cityName || '';
            item.cityCode = record?.cityCode || ''
            item.countyId = record?.countyId || '';
            item.countyName = record?.countyName || '';
            item.address = record?.address || '';
            item.contactUserName = record.contactUserName;
            item.contactUserTel = record.contactUserTel;
            item.reviewReasonCode = record.reviewReasonCode;
            item.reviewReasonId = record.reviewReasonId;
            item.reviewReasonName = record.reviewReasonName;
            item.reviewWayCode = record.reviewWayCode;
            item.reviewWayId = record.reviewWayId;
            item.reviewWayName = record.reviewWayName
            item.remark = record.remark;
            item.reviewMonth = record.reviewMonth;
          }
        })
      });
      setDataSource(copyDataSource);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          {!isView && (
            <div>
              <Button onClick={() => handleBtn('add')} type="primary">
                从合格供应商名录新增
              </Button>
              <Button
                disabled={data.selectRows.length === 0}
                onClick={() => {
                  handleBtn('edit');
                }}
                style={{ marginLeft: '5px' }}
              >
                批量编辑
              </Button>
              <Button
                disabled={data.selectedRowKeys.length === 0}
                onClick={() => {
                  handleBtn('delete');
                }}
                style={{ marginLeft: '5px' }}
              >
                删除
              </Button>
              <BatchImport
                disabled={dataSource.length === 0}
                name={'file'}
                params={dealDataSource()}
                action={`${window.location.origin + BASE_URL}/srm-sam-service/srController/importYearExcel`}
                // action={`${recommendUrl}/srController/importYearExcel`}
                downParams={[]}
                columns={columns}
                downLoadUrl={`${recommendUrl}/srController/downloadYearExcel`}
                downMethod="post"
                callback={importCallBack}
              />
            </div>
          )}
          <ExtTable
            style={{ marginTop: '10px' }}
            rowKey="reviewPlanYearLinenum"
            allowCancelSelect={true}
            showSearch={false}
            remotePaging
            checkbox={isView ? null : { multiSelect: true }}
            size="small"
            onSelectRow={handleSelectedRows}
            selectedRowKeys={data.selectedRowKeys}
            columns={columns}
            ref={tableRef}
            dataSource={dataSource}
          />
        </div>
      </div>
      {data.visible && (
        <AddModal
          visible={data.visible}
          title={data.title}
          type={data.type}
          handleCancel={setVisible}
          handleOk={handleOk}
          lineData={dataSource}
        />
      )}
      {batchEditVisible && (
        <BatchEditModal
          visible={batchEditVisible}
          onCancel={setBatchVisible}
          onOk={getBatchFormValue}
          originData={selectData}
        />
      )}
    </div>
  );
}

export default Form.create()(forwardRef(LineInfo));
