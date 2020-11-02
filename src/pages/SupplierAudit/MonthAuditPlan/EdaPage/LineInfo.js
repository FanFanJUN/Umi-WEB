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
import { Form, Button, Modal } from 'antd';
import { ExtTable } from 'suid';
import AddModal from './AddModal';
import BatchEditModal from './BatchEditModal';
// import AuditContentModal from "./AuditContentModal";
import AuditContentModal from "../../AuditRequirementsManagement/add/component/content";
import PersonManage from "./PersonManage";
import Team from "../../AuditRequirementsManagement/add/component/Team";
import { getRandom } from '../../../QualitySynergy/commonProps';

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
          <a onClick={(e) => {
            e.stopPropagation();
            setContentData({ 
              visible: true, 
              treeData: item.treeData,
              applyCorporationCode: item.applyCorporationCode,
              type: 'detail'
            });
          }} key="content">内容</a>
          <a onClick={(e) => {
            e.stopPropagation();
            setTeamData({ 
              visible: true, 
              treeData: item.treeData, 
              reviewTeamGroupBoList: item.reviewTeamGroupBoList,
              reviewTypeCode: item.reviewTypeCode,
              type: 'detail' 
            });
          }} style={{ margin: '0 3px' }} key="group">小组</a>
          <a onClick={(e) => {
            e.stopPropagation();
            setPersonData({
              visible: true,
              isView: true,
              originData: item.coordinationMemberBoList ? item.coordinationMemberBoList : []
            });
          }} key="xietong">协同</a>
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
        setContentData({ 
          visible: true,
          applyCorporationCode: data.selectRows[0]?.applyCorporationCode,
          treeData: data.selectRows[0]?.treeData, 
          type: 'edit'
        });
        break;
      case "teamM":
        setTeamData({ 
          visible: true, 
          treeData: data.selectRows[0]?.treeData, 
          reviewTeamGroupBoList: data.selectRows[0]?.reviewTeamGroupBoList,
          reviewTypeCode: data.selectRows[0]?.reviewTypeCode,
        });
        break;
      case "personM":
        setPersonData({
          visible: true,
          originData: (data.selectRows.length === 1)&&data.selectRows[0].coordinationMemberBoList ? data.selectRows[0].coordinationMemberBoList : []
        });
        break;
      default:
        break;
    }

  }
// 审核小组管理弹框-确定
  const teamOk = (value) => {
    let newData = JSON.parse(JSON.stringify(dataSource));
    newData.map((item, index) => {
      if (item.lineNum === data.selectedRowKeys[0]) {
        newData[index].reviewTeamGroupBoList = value;
      }
    });
    setDataSource(newData)
    setTeamData(v => ({...v, visible: false}))
    tableRef.current.manualSelectedRows();
  }
  // 编辑和明细时构造treeData
  const buildTreeData = (fatherList, sonList) => {
    if(!fatherList || !sonList)return[];
    let arr = JSON.parse(JSON.stringify(fatherList))
    arr.map(item => {
      item.id = item.systemId
      item.key = item.systemId
      item.title = item.systemName
      if (!item.children) {
        item.children = []
      }
      sonList.forEach(value => {
        value.id = value.systemId
        value.key = value.systemId
        value.title = value.systemName
        if (value.parentId === item.systemId) {
          item.children.push(value)
        }
      })
    })
    return arr
  }
  // 新增弹框-确定
  const handleAddOk = (value) => {
    console.log('行数据', value)
    let newList = value.map((item, index) => {
      let groupObj = {};
      item.treeData = buildTreeData(item.fatherList, item.sonList);
      item.lineNum = getRandom(10)
      if(item.reviewTeamGroupBoList) {
        for(var i=0; i<item.reviewTeamGroupBoList.length; i++) {
          console.log(item.reviewTeamGroupBoList[i])
          let lineObj = item.reviewTeamGroupBoList[i];
          lineObj.lineNum = getRandom(10)
          if(lineObj.reviewTeamMemberBoList) {
            for(let j = 0; j < lineObj.reviewTeamMemberBoList.length; j++) {
              let obj = lineObj.reviewTeamMemberBoList[j];
              if(obj.memberRole === "GROUP_LEADER" && !groupObj.leaderName) {
                groupObj.leaderId = obj.memberId;
                groupObj.leaderName = obj.memberName;
                groupObj.leaderTel = obj.memberTel;
                groupObj.leaderEmployeeNo = obj.employeeNo;
                groupObj.leaderDepartmentId = obj.departmentId;
                groupObj.leaderDepartmentCode = obj.departmentCode;
                groupObj.leaderDepartmentName = obj.departmentName;
                groupObj.codePath = obj.codePath;
                groupObj.namePath = obj.namePath;
              }
            }
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
  // 删除行数据
  const handleDelete = () => {
    Modal.confirm({
      title: "删除",
      content: "是否确认删除选中数据",
      onOk: ()=>{
        let newList = dataSource.filter(item => {
          return !data.selectedRowKeys.includes(item.lineNum);
        })
        newList = newList.map((item, index)=> {
          item.lineNum = index;
          return item;
        })
        setDataSource(newList);
        tableRef.current.manualSelectedRows();
      }
    })
  }
  // 批量编辑弹框-确定
  const getBatchFormValue = (value) => {
    let newList = dataSource.map(item => {
      if(data.selectedRowKeys.includes(item.lineNum)) {
        return {
          ...item,
          ...value
        }
      }
      return item;
    })
    tableRef.current.manualSelectedRows();
    setDataSource(newList);
  }
  // 审核内容管理弹框-确定
  const contentModalOk = (treeData) => {
    let newList = dataSource.map(item => {
      if(data.selectedRowKeys.includes(item.lineNum)) {
        item.fatherList = treeData;
        item.sonList = [];
        treeData.forEach(v => {
          item.sonList = item.sonList.concat(v.children)
        })
        item.treeData = buildTreeData(item.fatherList, item.sonList);
      }
      return item;
    })
    console.log('整合的数据', newList);
    setDataSource(newList);
    setContentData({ visible: false })
  }
  // 协同人员管理弹框-确定
  const personModalOk = (personData) => {
    setPersonData({ visible: false});
    let newList = dataSource.map(item => {
      if(data.selectedRowKeys.includes(item.lineNum)) {
        item.coordinationMemberBoList = personData
      }
      return item
    })
    console.log('整合的数据', newList);
    setDataSource(newList);
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
              <Button onClick={() => { handleBtn('edit') }} disabled={data.selectRows.length===0}>批量编辑</Button>
              <Button onClick={() => { handleDelete() }} disabled={data.selectRows.length===0}>删除</Button>
              <Button onClick={() => { handleBtn('contenM')}} disabled={data.selectRows.length===0}>审核内容管理</Button>
              <Button onClick={() => { handleBtn('teamM') }} disabled={data.selectRows.length!==1}>审核小组管理</Button>
              <Button onClick={() => { handleBtn('personM') }} disabled={data.selectRows.length===0}>协同人员管理</Button>
            </div>
          }
          <ExtTable
            style={{ marginTop: '10px' }}
            rowKey='lineNum'
            allowCancelSelect={true}
            showSearch={false}
            checkbox={{ multiSelect: true }}
            size='small'
            onSelectRow={(keys, rows) => {
              console.log("选中改变", keys, rows)
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
      {/* 批量编辑 */}
      { batchEditVisible && <BatchEditModal
        visible={batchEditVisible}
        onCancel={() => { setBatchEditVisible(false) }}
        originData={data.selectRows.length ===1 ? data.selectRows[0] : {}}
        onOk={getBatchFormValue}
      />
      }
      {/* 审核内容管理 */}
      {contentModalData.visible && <AuditContentModal
        applyCorporationCode={contentModalData.applyCorporationCode}
        type={contentModalData.type}
        visible={contentModalData.visible}
        treeData={contentModalData.treeData}
        onOk={contentModalOk}
        onCancel={() => setContentData({ visible: false })}
      />
      }
      {/* 审核小组管理 */}
      {teamModalData.visible && <Team
        onOk={teamOk}
        type={teamModalData.type}
        treeData={teamModalData.treeData}
        reviewTeamGroupBoList={teamModalData.reviewTeamGroupBoList}
        reviewTypeCode={teamModalData.reviewTypeCode}
        onCancel={() => setTeamData({ visible: false })}
        visible={teamModalData.visible}
      />
      }
      {/* 协同人员管理 */}
      {personModalData.visible && <PersonManage
        visible={personModalData.visible}
        originData={personModalData.originData}
        isView={personModalData.isView}
        onCancel={() => { setPersonData({ visible: false }) }}
        onOk={personModalOk}
      />
      }
    </div>
  );
})

export default Form.create()(LineInfo);
