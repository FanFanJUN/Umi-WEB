

import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import DynamicForm from './DynamicForm'
import styles from './index.less';
const { create } = Form;
const FormItem = Form.Item;
const { storage } = utils
const BaseinfoRef = forwardRef(({
	form,
	isView,
	baseinfo = [],
	editformData = {},
	wholeData = {},
	initialValues = {},
	onClickfication = () => null,
	onChangeMaterialLevel = () => null,
	approve,
	change
}, ref) => {
	useImperativeHandle(ref, () => ({
		getBaseInfo,
		getTemporaryBaseInfo,
		setHeaderFields,
		form
	}));
	const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
	const CommonconfigRef = useRef(null);
	//const [initialValue, setInitialValue] = useState({});
	let fieldsListed = [];
	baseinfo.map(item => {
		fieldsListed.push({
			title: item.title,
			key: item.key,
			verifi: item.verifi,
			type: 'input',
		})
	})
	const fieldsList = fieldsListed;
	const editData = editformData;
	const initialVal = initialValues
	useEffect(() => {
		// const { userName, userId, mobile } = storage.sessionStorage.get("Authorization");
		// setFieldsValue({
		//   phone: mobile
		// })
		// setCreateName(userName)
		// const {
		// 	id,
		// 	createdDate,
		// 	creatorName,
		// 	...other
		// } = initialValues;
		const { setHeaderFields } = CommonconfigRef.current;
		setHeaderFields(initialVal);
	}, [initialValues]);
	// 暂存表单
	function getTemporaryBaseInfo() {
		let extendVo = {};
		CommonconfigRef.current.form.validateFieldsAndScroll((err, values) => {
			if (values.attachments) {
				const { attachments } = values;
				values.genCertVos = Object.keys(attachments).map((key) => {
					return { qualificationType: key, attachments: attachments[key] === '' ? [] : attachments[key] };
				});
				delete values.attachments;
			}
			console.log(values)
			if (values.extendVo) {
				let { extendVo } = values;
				if (values.regFund) {
					extendVo.regFund = values.regFund.number;
					extendVo.currencyId = values.regFund.currency;
					delete values.regFund;
				}
				if (values.register) {
					if (values.register.province) {
						extendVo.registerProvinceId = values.register.province.key;
						extendVo.registerProvinceName = values.register.province.label;
					}
					if (values.register.city) {
						extendVo.registerRegionId = values.register.city.key;
						extendVo.registerRegionName = values.register.city.label;
					}
					if (values.register.area) {
						extendVo.registerDistrictId = values.register.area.key;
						extendVo.registerDistrictName = values.register.area.label;
					}
					extendVo.registerStreet = values.register.street;
					delete values.register;
				}
				if (values.office) {
					if (values.office.province) {
						extendVo.officeProvinceId = values.office.province.key;
						extendVo.officeProvinceName = values.office.province.label;
					}
					if (values.office.city) {
						extendVo.officeRegionId = values.office.city.key;
						extendVo.officeRegionName = values.office.city.label;
					}
					if (values.office.area) {
						extendVo.officeDistrictId = values.office.area.key;
						extendVo.officeDistrictName = values.office.area.label;
					}
					extendVo.officeStreet = values.office.street;
					delete values.office;
				}
			}
			extendVo = values;
		})
		console.log(extendVo)
		return extendVo
	}
	// 获取表单参数
	function getBaseInfo() {
		let result ;
		CommonconfigRef.current.form.validateFieldsAndScroll((err, values) => {
			if (!values.regFund.number) {
				setFieldsValue({ 'regFund': { number: '' } });
				form.validateFields(['regFund'], { force: true });
			}
			const { attachments } = values;
			values.genCertVos = Object.keys(attachments).map((key) => {
				return { qualificationType: key, attachments: attachments[key] === '' ? [] : attachments[key] };
			});
			
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
				delete values.attachments;
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
		//const { attachmentId = null, ...fs } = fields;
		// setAttachment(attachmentId)
		// setFieldsValue(fs)

		console.log(editData)
	}
	function ficationInfo(id) {
		onClickfication(id)
	}
	return (
		<div>
			<DynamicForm
				isView={isView}
				initialValues={initialValues}
				editData={editData}
				wholeData={wholeData}
				wrappedComponentRef={CommonconfigRef}
				formItems={fieldsList}
				selectfication={ficationInfo}
				approve={approve}
				change={change}
			/>
		</div>
	)
})
const CommonForm = create()(BaseinfoRef)

export default CommonForm