import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, message, Radio, Button } from 'antd';
import { ComboTree } from 'suid'
import { router } from 'dva';
import Cookies from 'js-cookie';
import SearchTable from '../../supplierRegister/components/SearchTable'
import { checkSupplierName, getImgUrl, UnifiedcheckCheckEmail } from '../../../services/supplierRegister'
import { chineseProvinceTableConfig, organpurchaseCompanyPropsreg } from '../../../utils/commonProps'
import { isEmpty } from '../../../utils'
const { create } = Form;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 14 },
    wrapperCol: { span: 10 },
};
const tipsLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const OrganizatRef = forwardRef(({
    hidden,
    form,
    accounts = [],
}, ref) => {
    useImperativeHandle(ref, () => ({
        getBinginfo,
        form
    }));
    const { query } = router.useLocation();
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configAcc, setConfigAcc] = useState([]);
    const [configure, setConfigure] = useState([]);
    const [imgUrl, setimgUrl] = useState({});
    const [reqId, setreqId] = useState({});
    const [btnText, setbtnText] = useState('获取验证码');
    const [btnBool, setbtnBool] = useState(false);
    const [imgCode, setimgCode] = useState('');
    const [isemail, setisemail] = useState(false);
    //const { attachment = null } = initialValues;
    useEffect(() => {
        SendPicCode()
        displayOrgan()
    }, [])
    // 表单
    function getBinginfo() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.supplierType = '1';
                values.openId = accounts.openId;
                result = values;
            }
        });
        return result;
    }
    // 图形码
    async function SendPicCode() {
        let reqId = (getUUID() + getUUID() + "-" + getUUID() + "-" + getUUID() + "-" + getUUID() + "-" + getUUID() + getUUID() + getUUID());
        setreqId(reqId)
        getImgUrl({ reqId: reqId }).then(res => {
            if (res.success) {
                setimgUrl(res.data)
            } else {
                message.error(res.msg);
            }
        })
    }
    function getUUID() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function blurImgCode(e) {
        setimgCode(e.target.value)
    }
    // 短信验证码
    async function SendCode() {
        let email = form.getFieldValue('email');
        let verifyCode = form.getFieldValue('verifyCode');
        let maxTime = 59;
        let timer;
        clearInterval(timer);
        if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email))) {
            message.error('请输入正确的邮箱');
            return false;
        }
        if (!verifyCode.trim()) {
            message.error('请填写图形验证码');
            return false;
        }
        let random = Math.floor(Math.random() * Math.pow(10, 13))
        console.log(reqId)
        const { success, message: msg } = await UnifiedcheckCheckEmail({
            email: email, reqId: reqId, code: imgCode
        })
        if (success) {
            message.success('邮箱验证码已发送，请注意查收');
            timer = setInterval(() => {
                if (maxTime > 0) {
                    --maxTime;
                    setbtnText(maxTime + '秒后重新获取')
                    setbtnBool(true)
                } else {
                    setbtnText('获取验证码')
                    setbtnBool(false)
                    clearInterval(timer);
                }
            }, 1000);
            return
        }
        message.error(msg)
    }

    function displayOrgan() {
        let strcookie = Cookies.get();
        let email = strcookie._m;
        if (isEmpty(email) || email === 'undefined') {
            setisemail(false)
        } else {
            setisemail(true)
        }
    }
    return (
        <div style={{ display: hidden ? "none" : "block", textAlign: 'center' }}>
            <p style={{ paddingTop: '50px', fontSize: '20px' }}>绑定邮箱</p>
            <Form style={{ paddingTop: '50px' }}>
                <Row>
                    <Col span={15}>
                        <FormItem
                            {...formItemLayout}
                            label={'电子邮箱'}
                        >
                            {
                                getFieldDecorator('email', {
                                    initialValue: '',
                                    rules: [
                                        //{ validator: onMailCheck, message: '请输入正确格式的电子邮箱！', whitespace: true },
                                        { required: true, message: '请输入电子邮箱' }
                                    ],
                                })(
                                    <Input
                                        disabled={isemail}
                                        maxLength={50}
                                        placeholder={'请输入电子邮箱'} />,
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={15}>
                        <FormItem
                            {...formItemLayout}
                            label={'图形验证码'}
                        >
                            {
                                getFieldDecorator('verifyCode', {
                                    initialValue: '',
                                    rules: [{ message: '请输入图形验证码！', whitespace: true },
                                    { required: true, message: '请输入图形验证码' }],
                                })(
                                    <Input placeholder="请输入图形验证码" onBlur={blurImgCode} />,
                                )
                            }

                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <img src={imgUrl} alt="" style={{ marginTop: 7, marginLeft: 8 }} onClick={SendPicCode} />
                    </Col>
                </Row>
                <Row>
                    <Col span={15}>
                        <FormItem
                            {...formItemLayout}
                            label={'邮箱验证码'}
                        >
                            {
                                getFieldDecorator('authCode', {
                                    initialValue: '',
                                    rules: [{ message: '请输入邮箱验证码！', whitespace: true },
                                    { required: true, message: '请输入邮箱验证码' }],
                                })(
                                    <Input placeholder="请输入邮箱验证码" type="number" />,
                                )
                            }

                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <Button onClick={SendCode} disabled={btnBool}
                            style={{ marginTop: 3, marginLeft: 8 }}>
                            {btnText}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
)
const CommonForm = create()(OrganizatRef)

export default CommonForm
