

import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import DetailForm from '../DeatilForm/index'
import {
	chineseProvinceTableConfig,
	cityListConfig,
	areaListConfig,
	currencyListConfigWithoutAuth,
	officechineseProvinceTableConfig,
	officecityListConfig,
	officeareaListConfig
} from '@/utils/commonProps'
import CascadeAddressSelect from "../components/CascadeAddressSelect";
import styles from './index.less';
const { create } = Form;
const FormItem = Form.Item;
const { storage } = utils
const BaseinfoRef = forwardRef(({
	form,
	isView,
	baseinfo = [],
	editformData = {},
	initialValues = {},
	onChangeMaterialLevel = () => null
}, ref) => {
	useImperativeHandle(ref, () => ({

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
	}, []);
	
	const formLayoutadds = {
		labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 20
		}
	}
	return (
		<div>
			<DetailForm
                //isView={false}
                editData={editData}
                formItems={fieldsList}
            />
		</div>
	)
})
const CommonForm = create()(BaseinfoRef)

export default CommonForm