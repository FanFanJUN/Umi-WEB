
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, Row, Input, Col, Button, Radio,Modal,message } from 'antd';
import { utils, ExtTable, AuthButton,DetailCard } from 'suid';
import classnames from 'classnames';
import styles from '../index.less';
import Header from '@/components/Header';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UploadFile from '../../../../components/Upload/index'
import StaffModal from './StaffModal'
import InformationModal from './informationModal'
import CustomerinforModal from './CustomerinforModal'
import AuditinforModal from './AuditinforModal'
import {isEmpty } from '../../../../utils';
const { create } = Form;
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 21
    },
};
const { storage } = utils
let typeid = []
const getconfirmFromRef = forwardRef(({
	form,
  isView,
  editData,
	onClickfication = () => null,
	Dyformname = () => null,
	headerInfo,
	change
}, ref) => {
	useImperativeHandle(ref, () => ({
		getBaseInfo,
		form
	}));
	const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
    const CommonconfigRef = useRef(null);
    const tabformRef = useRef(null);
    const verifformRef = useRef(null);
    const StaffFormRef = useRef(null);
    const getInformation = useRef(null);
    const getcustomerinfor = useRef(null);
    const getauditinfor = useRef(null)

    const [selectRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [staffData,setStaffData] = useState([]);
    const [selectedStaffKeys, setStaffKeys] = useState([]);
    const [selectedStaffRows, setStaffRows] = useState([]);
    const [stafvisible, setStafvisible] = useState(false);
    const [opinion, setOpinion] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [purchase, setPurchase] = useState([]);
    const [informationvisib, setInformationvisib] = useState(false);
    const [showAttach, triggerShowAttach] = useState(false);
    const emptyStaff = selectedStaffRows.length === 0; // 员工
    const empty = selectRowKeys.length === 0;
	  useEffect(() => {
      editToexamine(editData)
    }, [editData]);
    // 验证方案
    async function editToexamine(val) {
      if (val) {
        let materieldata = editData.smPcnAnalysisVos;
        console.log(materieldata)
        setDataSource(materieldata)
        setPurchase(editData.smPcnConfirmPlanVo)
      }
      if (!isEmpty(val)) {
        if (!isEmpty(val.smPcnConfirmPlanVo)) {
          let opentype = val.smPcnConfirmPlanVo.ideaStatus
          let editstaff = val.smPcnConfirmPlanVo.smPcnConfirmPlanTeamVos
          let newdata = [];
          if (editstaff.length > 0) {
            editstaff.map((item,index)=> {
              newdata.push({
                key:index,
                ...item
              })
            })
          }
          setOpinion(opentype)
          setStaffData(newdata)
        }
        
      }
    }
    // 采购小组表单
    const columns = [
      {
        title: '员工姓名',
        dataIndex: 'emloyeeName',
        align: 'center',
        width: 180,
      },
      {
        title: '员工编号',
        dataIndex: 'emloyeeNumber',
        align: 'center',
        width: 160
      }
    ]
    // 验证方案表单
    const verifColumns = [
        {
            title: '物料分类',
            dataIndex: 'materielCategoryId',
            align: 'center',
            width: 160
          },
          {
            title: '公司代码',
            dataIndex: 'companyCode',
            align: 'center',
            width: 180,
          },
          {
            title: '公司名称',
            dataIndex: 'companyName',
            align: 'center',
            width: 220
          },
          {
            title: '采购组织代码',
            dataIndex: 'purchaseOrgCode',
            align: 'center',
            width: 180,
          },
          {
            title: '采购组织名称',
            dataIndex: 'purchaseOrgName',
            align: 'center',
            width: 160
          },
          {
            title: '是否安规件',
            dataIndex: 'smPcnPart',
            align: 'center',
            width: 180,
            render: function (text, record, row) {
              if (text === 0) {
                  return <div>否</div>;
              } else if (text === 1) {
                  return <div className="doingColor">是</div>;
              } 
            },
          },
          {
            title: '是否实物认定',
            dataIndex: 'smInKindStatus',
            align: 'center',
            width: 160,
            render: function (text, record, row) {
              if (text === 0) {
                  return <div>否</div>;
              } else if (text === 1) {
                  return <div className="doingColor">是</div>;
              } 
            },
          },
          // {
          //   title: '信任公司',
          //   dataIndex: 'smTrustCompanyCode',
          //   align: 'center',
          //   width: 180,
          // },
          // {
          //   title: '信任采购组织',
          //   dataIndex: 'smTrustPurchasCode',
          //   align: 'center',
          //   width: 160
          // },
          {
            title: '实物认定确认人',
            dataIndex: 'smInKindManName',
            align: 'center',
            width: 180,
          },
          {
            title: '是否客户确认',
            dataIndex: 'smCustomerConfirm',
            align: 'center',
            width: 160,
            render: function (text, record, row) {
              if (text === 0) {
                  return <div>否</div>;
              } else if (text === 1) {
                  return <div className="doingColor">是</div>;
              } 
            },
          },
          {
            title: '客户意见确认人',
            dataIndex: 'smCustomerConfirmsName',
            align: 'center',
            width: 180,
          },
          {
            title: '是否供应商审核',
            dataIndex: 'smSupplierAuditStatus',
            align: 'center',
            width: 160,
            render: function (text, record, row) {
              if (text === 0) {
                return <div>否</div>;
              } else if (text === 1) {
                return <div className="doingColor">是</div>;
              } 
            },
          },
          {
            title: '供应商审核确认人',
            dataIndex: 'smSupplierAuditConfirmerName',
            align: 'center',
            width: 180,
          },
    ]
	// 获取表单参数
	function getBaseInfo() {
    let result = false,resultype,alltype = [];
    let purchasetab = tabformRef.current.data;
    if (purchasetab.length > 0 ) {
      form.validateFieldsAndScroll((err, val) => {
        if (!err) {
          let purchase = {
            smPcnConfirmPlanTeamVos:purchasetab,
            ideaStatus: val.ideaStatus,
            attachment: val.attachment
          }
          editData.smPcnConfirmPlanVo = {...editData.smPcnConfirmPlanVo,...purchase}
          result = editData
          let verificatab = verifformRef.current.data;
          if (opinion === 2 && verificatab.length > 0) {
            for (let item of verificatab) {
              if (isEmpty(item.smInKindStatus) || isEmpty(item.smCustomerConfirm) || isEmpty(item.smSupplierAuditStatus)) {
                message.error('请将验证方案数据填写完整！')
                result = false
                return false
              } else {
                if (verificatab.length === 1) {
                  resultype = verificatab.some(item => {
                    if (item.smInKindStatus === 0 && item.smCustomerConfirm === 0 && item.smSupplierAuditStatus === 0){
                      return true 
                    }
                  })
                }else {
                  let global;
                  verificatab.map(item =>{
                    if (item.smInKindStatus === 0 && item.smCustomerConfirm === 0 && item.smSupplierAuditStatus === 0){
                      alltype.push(true)                     
                    }else {
                      alltype.push(false)
                    }
                    global = isAllEqual(alltype)
                  })
                  resultype = global
                }
                if (resultype) {
                  message.error('当验证方案不能全部为否！')
                  result = false
                  return false
                }else {
                  let newverifica = verifformRef.current.data
                  editData.smPcnAnalysisVos.map((orig,indexs) => {
                    newverifica.map((items,index) => {
                      if (orig.id === items.id) {
                        editData.smPcnAnalysisVos.splice(indexs,1,items)
                      }
                    })
                  })
                  result = editData
                }
                // if (item.smInKindStatus === 0 && item.smCustomerConfirm === 0 && item.smSupplierAuditStatus === 0) {
                //   if (verificatab.length > 1) {
                //     alltype.push(true)
                //   }else {
                //     message.error('验证方案不能全部为否！')
                //     result = false
                //     return false
                //   }
                // }else {
                //   console.log(231)
                //   // if (verificatab.length > 1) {
                //   //   console.log(56)
                //   //   alltype.push(true)
                //   // } 
                // }
              }
            }
            // let global;
            // if (alltype.length > 1) {
            //   global = isAllEqual(alltype)
            //   if (global) {
            //     message.error('验证方案不能全部为否！')
            //     result = false
            //     return false
            //   }else {
            //     let newverifica = verifformRef.current.data
            //     editData.smPcnAnalysisVos.map((orig,indexs) => {
            //       newverifica.map((items,index) => {
            //         if (orig.id === items.id) {
            //           editData.smPcnAnalysisVos.splice(indexs,1,items)
            //         }
            //       })
            //     })
            //     result = editData
            //   }
            // }
          }
        }
      })
      return result;
    }else {
      message.error('采购小组成员最少有一行数据！')
      return false;
    }
  }
  function isAllEqual(array) {
    if (array.length > 0) {
      return !array.some(function (value, index) {
        return value !== array[0];
      });
    } else {
      return true;
    }
  }
  // 采购小组新增
  function showPurchase() {
    setStafvisible(true)
  }

  function showinformation() {
    getInformation.current.handleModalVisible(true)
  }
  function showCustomer() {
    getcustomerinfor.current.handleModalVisible(true)
  }
  function showAuditinfor() {
    getauditinfor.current.handleModalVisible(true)
  }
  // 关闭弹窗
  function handleCancel() {
    setStafvisible(false)
    setInformationvisib(false)
  }
  // 获取采购小组数据
  function handleStaff(val) {
    setStaffData(val)
    setStafvisible(false)
  }
  // 采购小组删除
  function PurchaseRemove() {
    const filterData = staffData.filter(item => item.key !== selectedStaffRows[0].key);
    setStaffData(filterData)
  }
  // 采购小组表单选择
  function PurSelectedRows(rowKeys,rows) {
    setStaffKeys(rowKeys)
    setStaffRows(rows)
  }
  // 初评意见选择
  function opinionChange(e) {
    setOpinion(e.target.value)
  }
  function hideAttach() {
    triggerShowAttach(false)

  }
  // 验证方案
  function handleSelectedRows(rowKeys, rows) {
    //console.log(rows)
    setRowKeys(rowKeys);
    setRows(rows);
  }
  // 编辑认定信息
  async function handleinfor (val) {
    const newdata = [...dataSource]
    newdata.map((item, index) => {
      val.map((items,indexs) => {
        if (item.id === items.id) {
          newdata.splice(index,1,items)
        }
      })
      
    })
    setDataSource(newdata)
    getInformation.current.handleModalVisible(false)
    uploadTable()
  }
  // 编辑客户信息
  function handlecustomer(val) {
    const newdata = [...dataSource]
    console.log(newdata)
    newdata.map((item, index) => {
      val.map((items,indexs) => {
        if (item.id === items.id) {
          newdata.splice(index,1,items)
        }
      })
      
    })
    setDataSource(newdata)
    getcustomerinfor.current.handleModalVisible(false)
    uploadTable()
  }
  // 编辑审核信息
  function handletoexamine(val) {
    const newdata = [...dataSource]
    newdata.map((item, index) => {
      val.map((items,indexs) => {
        if (item.id === items.id) {
          newdata.splice(index,1,items)
        }
      })
      
    })
    setDataSource(newdata)
    getauditinfor.current.handleModalVisible(false)
    uploadTable()
  } 
  function uploadTable() {
    tabformRef.current.remoteDataRefresh()
    tabformRef.current.manualSelectedRows([])
    verifformRef.current.remoteDataRefresh()
    verifformRef.current.manualSelectedRows([])
  }
  // 采购小组头部
  const headerleft = (
    <>
      {
        <AuthButton type="primary" className={styles.btn} onClick={() => showPurchase()}>新增</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={emptyStaff} onClick={PurchaseRemove}>删除</AuthButton>
      }
    </>
  );
  // 验证方案头部
  const verifheaderleft = (
    <>
      {
        <AuthButton className={styles.btn} onClick={() => showinformation()} disabled={empty}>编辑认定信息</AuthButton>
      }
      {
        <AuthButton className={styles.btn} onClick={() => showCustomer()} disabled={empty}>编辑客户信息</AuthButton>
      }
      {
        <AuthButton className={styles.btn} onClick={() => showAuditinfor()} disabled={empty}>编辑审核信息</AuthButton>
      }
    </>
  );
	return (
		<div>
			{/* <div className={classnames([styles.header, styles.flexBetweenStart])}>
                <span className={styles.title}>确认方案</span>
            </div> */}
            <div >
                <DetailCard title="采购小组成员">
                    <Header  style={{ display: headerInfo === true ? 'none' : 'block',color: 'red' }}
                        left={ headerInfo ? '' : headerleft}
                        advanced={false}
                        extra={false}
                    />
                    <AutoSizeLayout>
                        {
                        (height) => <ExtTable
                            columns={columns}
                            showSearch={false}
                            ref={tabformRef}
                            rowKey={(item) => item.key}
                            checkbox={{
                              multiSelect: false
                            }}
                            pagination={{
                              hideOnSinglePage: true,
                              disabled: false,
                              pageSize: 100,
                            }}
                            allowCancelSelect={true}
                            size='small'
                            height={height}
                            remotePaging={true}
                            ellipsis={false}
                            saveData={false}
                            onSelectRow={PurSelectedRows}
                            selectedRowKeys={selectedStaffKeys}
                            dataSource={staffData}
                        />
                        }
                    </AutoSizeLayout>
                    <Row>
                        <Col span={20}>
                            <FormItem {...formLayout} label="评审资料">
                                {getFieldDecorator('attachment', {
                                    rules: [
                                        {
                                            required: !isView,
                                            message: '请上传评审资料',
                                        },
                                    ],
                                })(
                                    <UploadFile
                                        title={"附件上传"}
                                        entityId={purchase ? purchase.reviewDataId : null}
                                        type={isView ? "show" : ""}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem {...formLayout} label="初评意见">
                                {getFieldDecorator('ideaStatus', {
                                    initialValue: purchase && purchase.ideaStatus,
                                    rules: [
                                        {
                                            required: !isView,
                                            message: '请选择初评意见',
                                        },
                                    ],
                                })(
                                    <Radio.Group disabled={isView === true} onChange={(e) => opinionChange(e)}>
                                        <Radio value={0}>不同意变更</Radio>
                                        <Radio value={1}>立即执行变更</Radio>
                                        <Radio value={2}>需要验证</Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </DetailCard>
                { 
                  opinion === 2 ? <DetailCard title="验证方案">
                      <Header  style={{ display: headerInfo === true ? 'none' : 'block',color: 'red' }}
                          left={ headerInfo ? '' : verifheaderleft}
                          advanced={false}
                          extra={false}
                      />
                      <AutoSizeLayout>
                          {
                          (height) => <ExtTable
                              columns={verifColumns}
                              showSearch={false}
                              ref={verifformRef}
                              rowKey={(item) => item.id}
                              checkbox={{
                                multiSelect: true
                              }}
                              pagination={{
                                hideOnSinglePage: true,
                                disabled: false,
                                pageSize: 100,
                              }}
                              allowCancelSelect={true}
                              size='small'
                              height={height}
                              remotePaging={true}
                              ellipsis={false}
                              saveData={false}
                              onSelectRow={handleSelectedRows}
                              selectedRowKeys={selectRowKeys}
                              dataSource={dataSource}
                          />
                          }
                      </AutoSizeLayout>    
                  </DetailCard> : null
                }
                
                {/**员工 */}
                <StaffModal
                    visible={stafvisible}
                    onCancel={handleCancel}
                    onOk={handleStaff}
                    wrappedComponentRef={StaffFormRef}
                    destroyOnClose
                />
                <Modal
                    visible={showAttach}
                    onCancel={hideAttach}
                    footer={
                        <Button type='ghost' onClick={hideAttach}>关闭</Button>
                    }
                ></Modal>
                {/**认定信息 */}
                <InformationModal
                  alonedata={editData} 
                  editData={selectedRows}
                  determine={handleinfor}  
                  wrappedComponentRef={getInformation}
                />
                {/**客户信息 */}
                <CustomerinforModal
                  editData={selectedRows}
                  customer={handlecustomer} 
                  wrappedComponentRef={getcustomerinfor} 
                />
                {/**审核信息 */}
                <AuditinforModal
                  editData={selectedRows}
                  toexamine={handletoexamine}  
                  wrappedComponentRef={getauditinfor} 
                />
            </div>
		</div>
	)
})
const CommonForm = create()(getconfirmFromRef)

export default CommonForm