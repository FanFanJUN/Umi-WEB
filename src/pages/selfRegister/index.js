import { useState, useEffect ,useRef} from 'react';
import { Button, message, Steps, Row, Checkbox } from "antd";
import RegistrationAgreement from './commons/RegistrationAgreement'
import BaseAccountInfo from './commons/BaseAccountInfo'
import { Wrapper } from './style'
const Step = Steps.Step;
let current = 0
export default function () {
    const BassAccounRef = useRef(null);
    const [current, setcurrent] = useState(0);
    const [checked, setchecked] = useState(false);
    useEffect(() => {

    }, []);
    //上一步
    function handlePre() {
        let count = current - 1;
        setcurrent(count)
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
        const { getAccountinfo } = BassAccounRef.current; //银行信息
        let bankVal = getAccountinfo()
    }
    return (
        <Wrapper>
            <header className='header'>
                <Steps current={current}>
                    <Step title={'入网须知'} />
                    <Step title={'注册信息'} />
                </Steps>
            </header>
            <article className="content">
                <RegistrationAgreement
                    hidden={current !== 0}
                />
                <BaseAccountInfo
                    hidden={current !== 1}
                    wrappedComponentRef={BassAccounRef}
                />
            </article>
            <footer className="footer">
                <Button hidden={current === 0} onClick={handlePre}>上一步</Button>
                <Button hidden={current === 0} style={{ marginLeft: 8 }}
                    onClick={supplierPayment}
                    type={"primary"}>提交</Button>

            </footer>
            <footer className="regfooter" hidden={current === 1}>
                <Checkbox className="checkoutname"
                    checked={checked}
                    onChange={onChange}
                >
                    我已阅读并同意此协议，并将在注册后上传盖章文件
          </Checkbox>
                <Button hidden={current === 1} style={{ marginLeft: 8 }}
                    className="buttonname"
                    onClick={handleNext}
                    type={"primary"}>下一步</Button>
            </footer>
        </Wrapper>
    )
}