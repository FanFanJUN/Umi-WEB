/*
 * @Author: Li Cai
 * @LastEditors: Please set LastEditors
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:54
 * @LastEditTime: 2020-12-11 18:04:02
 * @Description: 行信息
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/LineInfo.js
 */
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Form, Button, Modal, message } from 'antd';
import { ExtTable } from 'suid';
import { openNewTab } from '@/utils';
import AddModal from './AddModal';
import styles from '../index.less';
import BatchEditModal from './BatchEditModal';
import AuditContentModal from '../../AuditRequirementsManagement/add/component/content';
import PersonManage from './PersonManage';
import Team from '../../AuditRequirementsManagement/add/component/team';
import { getRandom } from '../../../QualitySynergy/commonProps';

let LineInfo = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    getTableList: () => dataSource.concat(deleteLine),
    getDeleteArr: () => deleteArr,
  }));
  const tableRef = useRef(null);
  const { originData, isView } = props;
  const [data, setData] = useState({
    selectRows: [],
    selectedRowKeys: [],
  });
  const [operation, setOperation] = useState(0);//
  const [dataSource, setDataSource] = useState([]);
  const [deleteLine, setDeleteLine] = useState([]);//删除的行数据
  const [deleteArr, setDeleteArr] = useState([]);//组合头上数据deleteArr，标记小组成员，协同人员的删除
  const [addModalData, setModalData] = useState({});
  const [batchEditVisible, setBatchEditVisible] = useState(false);
  const [contentModalData, setContentData] = useState({});
  const [teamModalData, setTeamData] = useState({});
  const [personModalData, setPersonData] = useState({});

  useEffect(() => {
    if (originData && originData.length > 0) {
      let newList = originData.map(item => {
        item.lineNum = getRandom(10);
        item.treeData = buildTreeData(item.sonList);
        item.reviewTeamGroupBoList = item.reviewTeamGroupBoList ? item.reviewTeamGroupBoList.map(v => ({
          ...v,
          lineNum: getRandom(10),
        })) : [];
        return item;
      });
      setDataSource(newList);
    }
  }, [originData]);
  const columns = [
    {
      title: '操作', dataIndex: 'operaton', width: 140, ellipsis: true, render: (text, item) => {
        return <div>
          {
            item.treeData && item.treeData.length > 0 && <a onClick={(e) => {
              e.stopPropagation();
              setTimeout(() => {
                setData(v => ({ ...v, treeData: item.treeData }));
              }, 300);
              setContentData(v => ({
                ...v,
                visible: true,
                type: 'detail',
                applyCorporationCode: item.applyCorporationCode,
                treeData: item.treeData ? item.treeData : [],
              }));
            }} key="content">内容</a>
          }
          {
            item.reviewTeamGroupBoList && <a onClick={(e) => {
              e.stopPropagation();
              setTeamData(v => ({
                ...v,
                reviewTeamGroupBoList: item.reviewTeamGroupBoList ? item.reviewTeamGroupBoList : [],
                visible: true,
                type: 'detail',
                treeData: item.treeData ? item.treeData : [],
              }));
            }} style={{ margin: '0 3px' }} key="group">小组</a>
          }
          {
            item.coordinationMemberBoList && <a onClick={(e) => {
              e.stopPropagation();
              setPersonData({
                visible: true,
                isView: true,
                originData: item.coordinationMemberBoList ? item.coordinationMemberBoList : [],
              });
            }} key="xietong">协同</a>
          }
        </div>;
      },
    },
    {
      title: '需求公司',
      dataIndex: 'applyCorporationName',
      width: 200,
      ellipsis: true,
      render: (v, record) => `${record.applyCorporationCode ? record.applyCorporationCode : ''} ${v ? v : ''}`,
    },
    {
      title: '采购组织',
      dataIndex: 'purchaseTeamName',
      ellipsis: true,
      width: 200,
      render: (v, record) => `${record.purchaseTeamCode ? record.purchaseTeamCode : ''} ${v ? v : ''}`,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      ellipsis: true,
      width: 200,
      render: (v, record) => `${record.supplierCode ? record.supplierCode : ''} ${v ? v : ''}`,
    },
    {
      title: '代理商',
      dataIndex: 'agentName',
      ellipsis: true,
      width: 200,
      render: (v, record) => `${record.agentCode ? record.agentCode : ''} ${v ? v : ''}`,
    },
    {
      title: '物料分类',
      dataIndex: 'materialGroupName',
      ellipsis: true,
      width: 140,
      render: (v, record) => `${v ? v : ''} ${record.materialGroupCode ? record.materialGroupCode : ''}`,
    },
    { title: '物料级别', dataIndex: 'materialGradeName', ellipsis: true, width: 140 },
    {
      title: '生产厂地址', dataIndex: 'countryName', ellipsis: true, width: 200, render: (text, item) => {
        return !text ? "" : (item.countryName + item.provinceName + item.cityName + item.countyName + item.address).replace(/(\s+)|(null)+/g, "");
      },
    },
    { title: '供应商联系人', dataIndex: 'contactUserName', ellipsis: true, width: 140 },
    { title: '供应商联系电话', dataIndex: 'contactUserTel', ellipsis: true, width: 120 },
    { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 100 },
    { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 120 },
    { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 100 },
    { title: '审核组织方式', dataIndex: 'reviewOrganizedWayName', ellipsis: true, width: 110 },
    { title: '专业组', dataIndex: 'specialtyTeamName', ellipsis: true, width: 140 },
    { title: '审核小组组长', dataIndex: 'leaderName', ellipsis: true, width: 120 },
    { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
    {
      title: '来源类型', dataIndex: 'sourceType', ellipsis: true, width: 140, render: (text) => {
        switch (text) {
          case 'Review_Plan_YEAR_LINE':
            return '年度审核计划';
          case 'ADMISSION_RECOMMENDATION':
            return '准入推荐';
          case 'RECOMMENDATION_REQUIREMENTS':
            return '审核需求';
        }
      },
    },
    {
      title: '来源单号', dataIndex: 'sourceCode', ellipsis: true, width: 140, render: (text, item) => {
        return <a onClick={() => {
          switch (item.sourceType) {
            case 'Review_Plan_YEAR_LINE':
              openNewTab(`supplierAudit/AnnualAuditPlanDetail?id=${item.sourceId}&pageState=detail`, '年度审核计划明细', false);
              break;
            case 'ADMISSION_RECOMMENDATION':
              openNewTab(`supplier/recommend/admittance/manage/detail?id=${item.sourceId}`, '供应商推荐准入明细', false);
              break;
            case 'RECOMMENDATION_REQUIREMENTS':
              openNewTab(`supplierAudit/AuditRequirementsManagementAdd?id=${item.sourceId}&pageState=detail`, '审核需求明细', false);
              break;
          }

        }}>{text}</a>
      }
    },
    { title: '来源单行号', dataIndex: 'sourceLinenum', ellipsis: true, width: 140 },
  ].map(item => ({ ...item, align: 'center' }));

  const handleBtn = (type) => {
    switch (type) {
      case 'annual':
      case 'recommand':
      case 'demand':
        setModalData({
          visible: true,
          type,
        });
        break;
      case 'edit':
        setBatchEditVisible(true);
        break;
      case 'contenM':
        setContentData({
          visible: true,
          applyCorporationCode: data.selectRows[0]?.applyCorporationCode,
          treeData: data.selectRows[0]?.treeData,
        });
        break;
      case 'teamM':
        setTeamData({
          visible: true,
          treeData: data.selectRows[0]?.treeData,
          reviewTeamGroupBoList: data.selectRows[0]?.reviewTeamGroupBoList,
          reviewTypeCode: data.selectRows[0]?.reviewTypeCode,
          type: 'edit',
        });
        break;
      case 'personM':
        setPersonData({
          visible: true,
          originData: (data.selectRows.length === 1) && data.selectRows[0].coordinationMemberBoList ? data.selectRows[0].coordinationMemberBoList : [],
        });
        break;
      default:
        break;
    }

  };

  // 审核小组管理弹框-确定
  const teamOk = (value) => {
    let newData = JSON.parse(JSON.stringify(dataSource));
    newData.map((item, index) => {
      if (item.lineNum === data.selectedRowKeys[0]) {
        newData[index].reviewTeamGroupBoList = value;
      }
    });
    setDataSource(newData);
    setTeamData(v => ({ ...v, visible: false }));
    tableRef.current.manualSelectedRows();
  };

  // 编辑和明细时构造treeData
  const buildTreeData = (sonList) => {
    if (!sonList || sonList.length === 0) return [];
    let arr = JSON.parse(JSON.stringify(sonList));
    arr.map(item => {
      item.id = item.systemId;
      item.key = item.systemId;
      item.title = item.systemName;
      item.name = item.systemName;
      item.code = item.systemCode;
      if (!item.children) {
        item.children = [];
      }
    });
    return arr;
  };

  // 新增弹框-确定
  const handleAddOk = (value) => {
    // console.log('行数据', value)
    let newList = [];
    value.forEach((item, index) => {
      if (!dataSource.some(v => v.sourceId === item.sourceId)) {
        let groupObj = {};
        item.treeData = buildTreeData(item.sonList);
        item.lineNum = getRandom(10);
        item.whetherDeleted = false;
        item.reviewPlanMonthLinenum = ((Array(4).join(0) + (index + 1 + dataSource.length)).slice(-4) + '0');
        if (item.reviewTeamGroupBoList) {
          for (var i = 0; i < item.reviewTeamGroupBoList.length; i++) {
            let lineObj = item.reviewTeamGroupBoList[i];
            lineObj.lineNum = getRandom(10);
            if (lineObj.reviewTeamMemberBoList) {
              for (let j = 0; j < lineObj.reviewTeamMemberBoList.length; j++) {
                let obj = lineObj.reviewTeamMemberBoList[j];
                if (obj.memberRole === 'GROUP_LEADER' && !groupObj.leaderName) {
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
        newList.push(newItem);
      }
    });
    newList = dataSource.concat(newList);
    setDataSource(newList);
    setModalData({ visible: false });
  };

  // 删除行数据
  const handleDelete = () => {
    Modal.confirm({
      title: '删除',
      content: '是否确认删除选中数据',
      onOk: () => {
        let tag = false;
        let arr = JSON.parse(JSON.stringify(deleteLine));
        let newList = dataSource.filter(item => {
          if (item.id && data.selectedRowKeys.includes(item.lineNum)) {
            // 已创建审核实施计划的行不可删除和编辑
            if (props.type === 'change' && item.whetherOccupied) {
              tag = true;
            }
            item.whetherDeleted = true;
            arr.push(item);
          }
          return !data.selectedRowKeys.includes(item.lineNum);
        });
        if (tag) {
          message.warning('存在已创建审核实施计划的行，不可删除');
          return;
        }
        newList = newList.map((item, index) => {
          item.lineNum = getRandom(10);
          item.reviewPlanMonthLinenum = ((Array(4).join(0) + (index + 1)).slice(-4) + '0');
          return item;
        });
        setDeleteLine(arr);
        setDataSource(newList);
        tableRef.current.manualSelectedRows();
      },
    });
  };

  // 批量编辑弹框-确定
  const getBatchFormValue = (value, isBatch) => {
    let newList;
    // 判断是否是批量编辑
    if (isBatch) {
      for (let key in value) {
        if (!value[key]) {
          delete value[key];
        }
      }
      newList = dataSource.map(item => {
        if (data.selectedRowKeys.includes(item.lineNum)) {
          return Object.assign(item, value);
        }
        return item;
      });
    } else {
      newList = dataSource.map(item => {
        if (data.selectedRowKeys.includes(item.lineNum)) {
          return {
            ...item,
            ...value,
          };
        }
        return item;
      });
    }
    setDataSource(newList);
    tableRef.current.manualSelectedRows();
  };

  // 审核内容管理弹框-确定
  const contentModalOk = (treeData) => {
    let newList = dataSource;
    if (data.selectRows.some(item => (item.reviewTeamGroupBoList && item.reviewTeamGroupBoList.length > 0)) && operation !== 0) {
      Modal.confirm({
        content: '修改内容将清空组员分配,请确认操作！',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          newList = dataSource.map(item => {
            if (data.selectedRowKeys.includes(item.lineNum)) {
              item.sonList = treeData;
              item.treeData = buildTreeData(item.sonList);
              item.reviewTeamGroupBoList && item.reviewTeamGroupBoList.map(v => {
                if (v.reviewTeamMemberBoList && v.reviewTeamMemberBoList.length !== 0) {
                  v.reviewTeamMemberBoList.map(r => {
                    r.memberRuleBoList = [];
                  });
                }
              });
            }
            return item;
          });
          setDataSource(newList);
          setContentData({ visible: false });
          tableRef.current.manualSelectedRows();
        },
      });
    } else {
      newList = dataSource.map(item => {
        if (data.selectedRowKeys.includes(item.lineNum)) {
          item.sonList = treeData;
          item.treeData = buildTreeData(item.sonList);
        }
        return item;
      });
      setDataSource(newList);
      setContentData({ visible: false });
      tableRef.current.manualSelectedRows();
    }

  };

  // 协同人员管理弹框-确定
  const personModalOk = (personData) => {
    setPersonData({ visible: false });
    let newList = dataSource.map(item => {
      if (data.selectedRowKeys.includes(item.lineNum)) {
        // console.log("进入处理数据")
        item.coordinationMemberBoList = personData;
      }
      return item;
    });
    // console.log('整合的数据', newList);
    setDataSource(newList);
    tableRef.current.manualSelectedRows();
  };

  // 变更时-检查选中数据是否可删除/编辑
  function checkSelect() {
    return data.selectRows.some(item => item.whetherOccupied);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          {
            (!isView || props.type === 'change') && <div className={styles.listBtn}>
              <Button onClick={() => handleBtn('annual')} type='primary'>从年度计划新增</Button>
              <Button onClick={() => handleBtn('recommand')} type='primary'>从准入推荐新增</Button>
              <Button onClick={() => handleBtn('demand')} type='primary'>从审核需求新增</Button>
              <Button onClick={() => {
                handleBtn('edit');
              }} disabled={data.selectRows.length === 0 || checkSelect()}>批量编辑</Button>
              <Button onClick={() => {
                handleDelete();
              }} disabled={data.selectRows.length === 0 || checkSelect()}>删除</Button>
              <Button onClick={() => {
                handleBtn('contenM');
              }} disabled={data.selectRows.length === 0 || checkSelect()}>审核内容管理</Button>
              <Button onClick={() => {
                handleBtn('teamM');
              }} disabled={data.selectRows.length !== 1 || checkSelect()}>审核小组管理</Button>
              <Button onClick={() => {
                handleBtn('personM');
              }} disabled={data.selectRows.length === 0 || checkSelect()}>协同人员管理</Button>
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
              // console.log("选中改变", keys, rows)
              setData(() => ({ selectedRowKeys: keys, selectRows: rows }));
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
        handleCancel={() => {
          setModalData({ visible: false });
        }}
        handleOk={handleAddOk}
        lineData={dataSource}
      />}
      {/* 批量编辑 */}
      {batchEditVisible && <BatchEditModal
        visible={batchEditVisible}
        onCancel={() => {
          setBatchEditVisible(false);
        }}
        selectedRows={data.selectRows}
        onOk={getBatchFormValue}
      />
      }
      {/* 审核内容管理 */}
      {contentModalData.visible && <AuditContentModal
        applyCorporationCode={contentModalData.applyCorporationCode}
        type={contentModalData.type}
        visible={contentModalData.visible}
        treeData={contentModalData.treeData}
        setOperation={setOperation}
        onOk={contentModalOk}
        onCancel={() => setContentData({ visible: false })}
      />
      }
      {/* 审核小组管理 */}
      {teamModalData.visible && <Team
        onOk={teamOk}
        deleteArr={deleteArr}
        setDeleteArr={setDeleteArr}
        type={teamModalData.type ? teamModalData.type : 'add'}
        treeData={teamModalData.treeData}
        reviewTeamGroupBoList={teamModalData.reviewTeamGroupBoList ? teamModalData.reviewTeamGroupBoList : []}
        reviewTypeCode={teamModalData.reviewTypeCode}
        onCancel={() => setTeamData({ visible: false })}
        visible={teamModalData.visible}
      />
      }
      {/* 协同人员管理 */}
      {personModalData.visible && <PersonManage
        visible={personModalData.visible}
        deleteArr={deleteArr}
        setDeleteArr={setDeleteArr}
        originData={personModalData.originData}
        isView={personModalData.isView}
        onCancel={() => {
          setPersonData({ visible: false });
        }}
        onOk={personModalOk}
      />
      }
    </div>
  );
});

export default Form.create()(LineInfo);
