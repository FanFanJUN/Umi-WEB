/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:54
 * @LastEditTime: 2020-10-23 17:47:33
 * @Description: 行信息
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/LineInfo.js
 */
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import styles from '../index.less';
import { Form, Button } from 'antd';
import { ExtTable } from 'suid';
import AddModal from './AddModal';
import BatchEditModal from './BatchEditModal';
// import AuditContentModal from "./AuditContentModal";
import AuditContentModal from "../../AuditRequirementsManagement/add/component/content";
import PersonManage from "./PersonManage";
import Team from "../../AuditRequirementsManagement/add/component/team";

let LineInfo = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    getTableList
  }))
  const tableRef = useRef(null);

  const [data, setData] = useState({
    selectRows: [],
    selectedRowKeys: [],
  });

  const [dataSource, setDataSource] = useState([]);
  const [addModalData, setModalData] = useState({});
  const [batchEditVisible, setBatchEditVisible] = useState(false);
  const [contentModalData, setContentData] = useState({});
  const [teamModalData, setTeamData] = useState({});
  const [personModalData, setPersonData] = useState({})

  const columns = [
    {
      title: '操作', dataIndex: 'operaton', width: 140, ellipsis: true, render: (text, item) => {
        return <div>
          <a onClick={() => { console.log("跳转到内容") }} key="content">内容</a>
          <a onClick={() => { console.log("跳转到小组") }} style={{ margin: '0 3px' }} key="group">小组</a>
          <a onClick={() => { console.log("跳转到协同") }} key="xietong">协同</a>
        </div>
      }
    },
    { title: '需求公司', dataIndex: 'applyCorporationName', width: 140, ellipsis: true, },
    { title: '采购组织', dataIndex: 'purchaseTeamName', ellipsis: true, width: 140 },
    { title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 140 },
    { title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 140 },
    { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 140 },
    { title: '物料级别', dataIndex: 'materialGradeName', ellipsis: true, width: 140 },
    { title: '生产厂地址', dataIndex: 'data2', ellipsis: true, width: 180, render:(text, item)=>{
      return item.countryName + item.provinceName + item.cityName + item.countyName + item.address
    }},
    { title: '供应商联系人', dataIndex: 'contactUserName', ellipsis: true, width: 140 },
    { title: '供应商联系电话', dataIndex: 'contactUserTel', ellipsis: true, width: 140 },
    { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 140 },
    { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 140 },
    { title: '审核组织方式', dataIndex: 'reviewOrganizedWayName', ellipsis: true, width: 140 },
    { title: '专业组', dataIndex: 'specialtyTeamName', ellipsis: true, width: 140 },
    { title: '审核小组组长', dataIndex: 'leaderName', ellipsis: true, width: 140 },
    { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
    {
      title: '来源类型', dataIndex: 'sourceType', ellipsis: true, width: 140, render: (text) => {
        switch (text) {
          case "Review_Plan_YEAR_LINE":
            return "年度计划行";
          case "ADMISSION_RECOMMENDATION":
            return "准入推荐";
          case "RECOMMENDATION_REQUIREMENTS":
            return "推荐需求";
        }
      }
    },
    { title: '来源单号', dataIndex: 'sourceCode', ellipsis: true, width: 140 },
    { title: '来源单行号', dataIndex: 'sourceLinenum', ellipsis: true, width: 140 },
  ].map(item => ({ ...item, align: 'center' }))

  const { isView } = props;
  function getTableList() {
    return dataSource;
  }
  const handleBtn = (type) => {
    switch (type) {
      case "annual":
      case "recommand":
      case "demand":
        setModalData({
          visible: true,
          type
        });
        break;
      case "edit":
        setBatchEditVisible(true);
        break;
      case "contenM":
        setContentData({ visible: true, treeData: [] });
        break;
      case "teamM":
        setTeamData({ visible: true, treeData: [], selectRows: [] });
        break;
      case "personM":
        setPersonData({ visible: true, originData: [] });
        break;
      default:
        break;
    }

  }

  const handleAddOk = (value) => {
    console.log('行数据', value)
    let newList = value.map((item, index) => {
      let groupObj = {};
      item.lineNum = dataSource.length + index;
      // debugger;
      if(item.reviewTeamGroupBoList) {
        for(var i=0; i<item.reviewTeamGroupBoList.length; i++) {
          let lineObj = item.reviewTeamGroupBoList[i];
          if(lineObj.reviewTeamMemberBoList) {
            for(let j = 0; j < lineObj.reviewTeamMemberBoList.length; j++) {
              let obj = lineObj.reviewTeamMemberBoList[j];
              if(obj.memberRole === "GROUP_LEADER") {
                groupObj.leaderId = obj.memberId;
                groupObj.leaderName = obj.memberName;
                groupObj.leaderTel = obj.memberTel;
                groupObj.leaderEmployeeNo = obj.employeeNo;
                groupObj.leaderDepartmentId = obj.departmentId;
                groupObj.leaderDepartmentCode = obj.departmentCode;
                groupObj.leaderDepartmentName = obj.departmentName;
                groupObj.codePath = obj.codePath;
                groupObj.namePath = obj.namePath;
                break;
              }
            }
          }
          if(Object.keys(groupObj).length > 0) {
            break;
          }
        }
      }
      let newItem = Object.assign(item, groupObj);
      return newItem;
    })
    newList = dataSource.concat(newList);
    setDataSource(newList);
    setModalData({ visible: false });
  }
  const getBatchFormValue = (value) => {
    console.log("批量编辑确定")
  }
  const contentModalOk = (treeData) => {
    console.log("审核内容管理", treeData);
    setContentData({ visible: false })
  }
  const personModalOk = (personData) => {
    console.log("协同人员管理确定", personData)
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          {
            !isView && <div className={styles.listBtn}>
              <Button onClick={() => handleBtn('annual')} type='primary'>从年度计划新增</Button>
              <Button onClick={() => handleBtn('recommand')} type='primary'>从准入推荐新增</Button>
              <Button onClick={() => handleBtn('demand')} type='primary'>从审核需求新增</Button>
              <Button onClick={() => { handleBtn('edit') }} >批量编辑</Button>
              <Button onClick={() => { handleBtn('delete') }} >删除</Button>
              <Button onClick={() => { handleBtn('contenM') }} >审核内容管理</Button>
              <Button onClick={() => { handleBtn('teamM') }} >审核小组管理</Button>
              <Button onClick={() => { handleBtn('personM') }} >协同人员管理</Button>
            </div>
          }
          <ExtTable
            style={{ marginTop: '10px' }}
            rowKey='lineNum'
            allowCancelSelect={true}
            showSearch={false}
            checkbox={{ multiSelect: false }}
            size='small'
            onSelectRow={(keys, rows) => {
              setData(() => ({ selectedRowKeys: keys, selectRows: rows }))
            }}
            selectedRowKeys={data.selectedRowKeys}
            columns={columns}
            ref={tableRef}
            dataSource={dataSource}
          />
        </div>
      </div>
      {/* 新增弹框 */}
      {addModalData.visible && <AddModal
        visible={addModalData.visible}
        type={addModalData.type}
        handleCancel={() => { setModalData({ visible: false }) }}
        handleOk={handleAddOk}
        lineData={dataSource}
      />}
      { batchEditVisible && <BatchEditModal
        visible={batchEditVisible}
        onCancel={() => { setBatchEditVisible(false) }}
        onOk={getBatchFormValue}
      />
      }
      {contentModalData.visible && <AuditContentModal
        visible={contentModalData.visible}
        treeData={contentModalData.treeData}
        onOk={contentModalOk}
        onCancel={() => setContentData({ visible: false })}
      />
      }
      {teamModalData.visible && <Team
        type={teamModalData.type}
        treeData={teamModalData.treeData}
        reviewTypeCode={teamModalData.selectRows[0]?.reviewTypeCode}
        onCancel={() => setTeamData({ visible: false })}
        visible={teamModalData.visible}
      />
      }
      {personModalData.visible && <PersonManage
        visible={personModalData.visible}
        originData={personModalData.originData}
        onCancel={() => { setPersonData({ visible: false }) }}
        onOk={personModalOk}
      />
      }
    </div>
  );
})

export default Form.create()(LineInfo);
