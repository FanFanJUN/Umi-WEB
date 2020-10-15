
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, Row, Input, Col, Button, Radio,Modal } from 'antd';
import { utils, ExtTable, AuthButton,DetailCard } from 'suid';
import classnames from 'classnames';
import styles from '../index.less';
import Header from '@/components/Header';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UploadFile from '../../../../components/Upload/index'
import StaffModal from './StaffModal'
import InformationModal from './informationModal'
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
const ConfirmFromRef = forwardRef(({
	form,
	isView,
	baseinfo = [],
	editformData = {},
	wholeData = {},
	initialValues = {},
	onClickfication = () => null,
	Dyformname = () => null,
	headerInfo,
	change
}, ref) => {
	useImperativeHandle(ref, () => ({
		getBaseInfo,
		setHeaderFields,
		form
	}));
	const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
    const CommonconfigRef = useRef(null);
    const tabformRef = useRef(null);
    const verifformRef = useRef(null);
    const StaffFormRef = useRef(null);
    const getInformation = useRef(null);
    const [selectRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [stafvisible, setStafvisible] = useState(false);
    const [informationvisib, setInformationvisib] = useState(false);
    const [showAttach, triggerShowAttach] = useState(false);
    const empty = selectRowKeys.length === 0;
	useEffect(() => {
		
    }, []);
    const dataSource = [];
    // 采购小组表单
    const columns = [
        {
            title: '员工编号',
            dataIndex: 'lineCode',
            align: 'center',
            width: 160
          },
          {
            title: '员工姓名',
            dataIndex: 'countryName',
            align: 'center',
            width: 180,
          },
    ]
    // 验证方案表单
    const verifColumns = [
        {
            title: '物料分类',
            dataIndex: 'lineCode',
            align: 'center',
            width: 160
          },
          {
            title: '公司代码',
            dataIndex: 'countryName',
            align: 'center',
            width: 180,
          },
          {
            title: '公司名称',
            dataIndex: 'lineCode',
            align: 'center',
            width: 160
          },
          {
            title: '采购组织代码',
            dataIndex: 'countryName',
            align: 'center',
            width: 180,
          },
          {
            title: '采购组织名称',
            dataIndex: 'lineCode',
            align: 'center',
            width: 160
          },
          {
            title: '是否安规件',
            dataIndex: 'countryName',
            align: 'center',
            width: 180,
          },
          {
            title: '是否实物认定',
            dataIndex: 'lineCode',
            align: 'center',
            width: 160
          },
          {
            title: '信任公司',
            dataIndex: 'countryName',
            align: 'center',
            width: 180,
          },
          {
            title: '信任采购组织',
            dataIndex: 'lineCode',
            align: 'center',
            width: 160
          },
          {
            title: '实物认定确认人',
            dataIndex: 'countryName',
            align: 'center',
            width: 180,
          },
          {
            title: '是否客户确认',
            dataIndex: 'lineCode',
            align: 'center',
            width: 160
          },
          {
            title: '客户意见确认人',
            dataIndex: 'countryName',
            align: 'center',
            width: 180,
          },
          {
            title: '是否供应商审核',
            dataIndex: 'lineCode',
            align: 'center',
            width: 160
          },
          {
            title: '供应商审核确认人',
            dataIndex: 'countryName',
            align: 'center',
            width: 180,
          },
    ]
	// 获取表单参数
	function getBaseInfo() {
		let result = false;
		CommonconfigRef.current.form.validateFieldsAndScroll((err, values) => {
			if (values && values.regFund && !values.regFund.number) {
				setFieldsValue({ 'regFund': { number: '' } });
				form.validateFields(['regFund'], { force: true });
			}
			const { attachments } = values;
			values.genCertVos = Object.keys(attachments).map((key) => {
				return { qualificationType: key, attachments: attachments[key] === '' ? [] : attachments[key] };
			});
			delete values.attachments;
			if (!err) {
				let {extendVo} = values;
				if (values.regFund) {
					extendVo.regFund = values.regFund.number;
					extendVo.currencyId = values.regFund.currency;
				} 
				if (values.register) {
					extendVo.registerProvinceName = values.register.province.label;
					extendVo.registerProvinceId = values.register.province.key;
					extendVo.registerRegionId = values.register.city.key;
					extendVo.registerRegionName = values.register.city.label;
					extendVo.registerDistrictId = values.register.area.key;
					extendVo.registerDistrictName = values.register.area.label;
					extendVo.registerStreet = values.register.street;
				}
				if (values.office) {
					extendVo.officeProvinceId = values.office.province.key;
					extendVo.officeProvinceName = values.office.province.label;
					extendVo.officeRegionId = values.office.city.key;
					extendVo.officeRegionName = values.office.city.label;
					extendVo.officeDistrictId = values.office.area.key;
					extendVo.officeDistrictName = values.office.area.label;
					extendVo.officeStreet = values.office.street;

				}
				
				delete values.register;
				delete values.office;
				result = values;
			}
		})
		console.log(result)
		return result;
	}

	// 设置所有表格参数
	async function setHeaderFields(fields) {
		
	}
	function ficationInfo(id) {
		console.log(id)
		onClickfication(id)
	}
	function setSupplier(name) {
		console.log(name)
		Dyformname(name)
  }
  // 采购小组新增
  function showPurchase() {
    setStafvisible(true)
  }
  // 采购小组删除
  function PurchaseRemove() {

  }
  function showinformation() {
    getInformation.current.handleModalVisible(true)
  }
  // 关闭弹窗
  function handleCancel() {
    setStafvisible(false)
    setInformationvisib(false)
  }
  // 获取采购小组数据
  function handleStaff() {

  }
  // 采购小组表单选择
  function PurSelectedRows() {

  }
  function hideAttach() {
    triggerShowAttach(false)

  }
  // 采购小组头部
  const headerleft = (
    <>
      {
        <AuthButton type="primary" className={styles.btn} onClick={() => showPurchase()}>新增</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={empty} onClick={PurchaseRemove}>删除</AuthButton>
      }
    </>
  );
  // 验证方案头部
  const verifheaderleft = (
    <>
      {
        <AuthButton className={styles.btn} onClick={() => showinformation()}>编辑认定信息</AuthButton>
      }
      {
        <AuthButton className={styles.btn} onClick={PurchaseRemove}>编辑客户信息</AuthButton>
      }
      {
        <AuthButton className={styles.btn} onClick={PurchaseRemove}>编辑审核信息</AuthButton>
      }
    </>
  );
	return (
		<div>
			<div className={classnames([styles.header, styles.flexBetweenStart])}>
                <span className={styles.title}>确认方案</span>
            </div>
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
                            allowCancelSelect={true}
                            size='small'
                            height={height}
                            remotePaging={true}
                            ellipsis={false}
                            saveData={false}
                            onSelectRow={PurSelectedRows}
                            selectedRowKeys={selectRowKeys}
                            dataSource={dataSource}
                        />
                        }
                    </AutoSizeLayout>
                    <Row>
                        <Col span={20}>
                            <FormItem {...formLayout} label="评审资料">
                                {getFieldDecorator('smFieldCode', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请上传评审资料',
                                        },
                                    ],
                                })(
                                    <UploadFile
                                        title={"附件上传"}
                                        entityId={dataSource ? dataSource.enclosureId : null}
                                        type={isView ? "show" : ""}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem {...formLayout} label="初评意见">
                                {getFieldDecorator('smFieldCode', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择初评意见',
                                        },
                                    ],
                                })(
                                    <Radio.Group disabled={isView === true}>
                                        <Radio value={true}>不同意变更</Radio>
                                        <Radio value={false}>立即执行变更</Radio>
                                        <Radio value={false}>需要验证</Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </DetailCard>
                <DetailCard title="验证方案">
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
                            rowKey={(item) => item.key}
                            checkbox={{
                            multiSelect: false
                            }}
                            allowCancelSelect={true}
                            size='small'
                            height={height}
                            remotePaging={true}
                            ellipsis={false}
                            saveData={false}
                            onSelectRow={PurSelectedRows}
                            selectedRowKeys={selectRowKeys}
                            dataSource={dataSource}
                        />
                        }
                    </AutoSizeLayout>    
                </DetailCard>
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
                   wrappedComponentRef={getInformation}
                />
            </div>
		</div>
	)
})
const CommonForm = create()(ConfirmFromRef)

export default CommonForm