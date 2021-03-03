import { useState, useEffect, useRef } from 'react';
import { Button, message, Steps, Row, Checkbox } from "antd";
import { router } from 'dva';
import Cookies from 'js-cookie';
import RegistrationAgreement from './commons/RegistrationAgreement'
import SupplierSelectype from './commons/SupplierSelectype'
import BindingEmail from './commons/BindingEmail'
import BaseAccountInfo from './commons/BaseAccountInfo'
import { saveRegistVo, bindingEmail } from '../../services/supplierRegister'
import { Wrapper } from './style'
import { closeCurrent, isEmpty } from '../../utils'
const srmBaseUrl = "/srm-se-web";
const Step = Steps.Step;
export default function () {
    const { query } = router.useLocation();
    const BassAccounRef = useRef(null);
    const SupplierRef = useRef(null);
    const BindingRef = useRef(null);
    const [current, setcurrent] = useState(0);
    const [checked, setchecked] = useState(false);
    const [loading, triggerLoading] = useState(false);
    const [accounts, setaccounts] = useState(false);
    const [assignment, setassignment] = useState('');
    const [bingemail, setBingemail] = useState(false);
    const [classtype, setClasstype] = useState(false);
    const [email, setEmail] = useState('');
    useEffect(() => {
        let organ = {};
        let strcookie = Cookies.get();
        organ.mobile = strcookie._p;
        if (strcookie._m === 'undefined' || strcookie._m === undefined) {
            organ.email = '';
            setBingemail(true)
        } else {
            organ.email = strcookie._m
        }
        organ.openId = strcookie._o
        setaccounts(organ)
    }, []);
    //上一步
    function handlePre() {
        let count = current - 1;
        setcurrent(count)
        if (bingemail && classtype) {
            setClasstype(false)
            setBingemail(false)
        }
    };

    //下一步
    function handleNext() {
        if (!checked) {
            message.error('请阅读并勾选协议！');
            return;
        }
        next();
    };
    function next() {
        let count = current + 1;
        setcurrent(count)
    };
    function onChange(e) {
        setchecked(e.target.checked)
    }
    // 提交
    async function supplierPayment() {
        const { getAccountinfo } = BassAccounRef.current;
        let resultData = getAccountinfo()
        if (resultData) {
            triggerLoading(true)
            const { data, success, message: msg } = await saveRegistVo({ registrationInformationVo: JSON.stringify(resultData) })
            if (success) {
                Cookies.remove('_o');
                Cookies.remove('_m');
                Cookies.remove('_p');
                closeCurrent()
                window.open(`/react-basic-web/index?_s=` + data)
                triggerLoading(false)
                //window.open(`/srm-se-web/NewHomePageView?_s=` + data)
            } else {
                message.error(msg);
                triggerLoading(false)
            }

        }
    }
    // 选择供应商注册类型
    async function handleSupplier() {
        const { getTypeinfo } = SupplierRef.current;
        let resultnum = getTypeinfo()
        if (isEmpty(resultnum.organization) && isEmpty(resultnum.personal)) {
            message.error('请选择需要注册的供应商类型！');
        } else {
            if (!isEmpty(resultnum.organization)) {
                setassignment(resultnum.organization)
            }
            if (!isEmpty(resultnum.personal)) {
                setassignment(resultnum.personal)
            }

        }
        // 个人
        if (!isEmpty(resultnum.personal) && resultnum.personal === 0) {
            next()
        }
        // 组织
        if (!isEmpty(resultnum.organization) && resultnum.organization === 1) {
            if (!isEmpty(accounts.email)) {
                next()
            } else {
                if (email) {
                    setcurrent(2)
                    setClasstype(false)
                } else {
                    setBingemail(true)
                    setClasstype(true)
                    setcurrent(1)
                }

            }
        }

    }
    // 绑定邮箱上一步
    function handleBack() {
        setClasstype(false)
        setBingemail(false)
    }
    // 邮箱绑定
    async function handleEmail() {
        const { getBinginfo } = BindingRef.current;
        let resultData = getBinginfo()
        let strcookie = Cookies.get();
        if (resultData) {
            resultData.openId = strcookie._o
            triggerLoading(true)
            const { data, success, message: msg } = await bindingEmail(resultData)
            if (success) {
                accounts.email = resultData.email
                setEmail(resultData.email)
                next()
                triggerLoading(false)
            } else {
                message.error(msg);
                triggerLoading(false)
            }
        } else {
            message.error('邮箱绑定后才可进行下一步！');
        }
    }
    return (
        <Wrapper>
            <header className='header'>
                <Steps current={current}>
                    <Step title={'入网须知'} />
                    <Step title={'选择供应商类型'} />
                    <Step title={'注册信息'} />
                </Steps>
            </header>
            <article className="content">
                <RegistrationAgreement
                    hidden={current !== 0}
                />
                {
                    !classtype ? <SupplierSelectype
                        hidden={current !== 1}
                        wrappedComponentRef={SupplierRef}
                    /> : null
                }

                {
                    bingemail && assignment === 1 ? <BindingEmail
                        hidden={current !== 1}
                        wrappedComponentRef={BindingRef}
                    /> : null
                }
                <BaseAccountInfo
                    hidden={current !== 2}
                    accounts={accounts}
                    assignment={assignment}
                    wrappedComponentRef={BassAccounRef}
                />
            </article>
            {/* 第四步 */}
            <footer className="footer" >
                <Button onClick={handlePre} hidden={current !== 2}>上一步</Button>
                <Button style={{ marginLeft: 8 }} hidden={current !== 2}
                    loading={loading}
                    onClick={supplierPayment}
                    type={"primary"}>提交</Button>

            </footer>
            {/* 第一步 */}
            <footer className="regfooter" hidden={current !== 0}>
                <Checkbox className="checkoutname"
                    checked={checked}
                    onChange={onChange}
                >
                    我已阅读并同意此协议，并将在注册后上传盖章文件
                 </Checkbox>
                <Button style={{ marginLeft: 8 }}
                    loading={loading}
                    className="buttonname"
                    onClick={handleNext}
                    type={"primary"}>下一步</Button>
            </footer>
            {/* 第二步 */}
            {
                !classtype ? <footer className="regfooter" hidden={current !== 1}>
                    <Button onClick={handlePre}>上一步</Button>
                    <Button style={{ marginLeft: 8 }}
                        loading={loading}
                        className="buttonname"
                        onClick={handleSupplier}
                        type={"primary"}>下一步</Button>
                </footer> : null
            }

            {/* 组织第三步 */}
            {
                classtype ? <footer className="regfooter" hidden={current !== 1}>
                    <Button onClick={handleBack}>上一步</Button>
                    <Button style={{ marginLeft: 8 }}
                        loading={loading}
                        className="buttonname"
                        onClick={handleEmail}
                        type={"primary"}>下一步</Button>
                </footer> : null
            }


        </Wrapper >
    )
}
