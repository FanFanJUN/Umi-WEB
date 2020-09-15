import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import {Form} from 'antd';
const { create } = Form;
const BaseAccountRef = forwardRef(({
  hidden,

}, ref) => {
  useImperativeHandle(ref, () => ({

  }))
  return (
    <div style={{ padding: "10px auto", display: hidden ? "none" : "block", width: "80%", margin: "10px auto" }}>
      <h1 align="center" style={{ fontSize: "1.5em", fontFamily: '宋体（中文正文）', fontWeight: 'bold', color: "#5B5B5B" }}>
        供应商注册须知
    </h1>
      <br />
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）' }}>
        欢迎您来到长虹智慧供应链平台，在您注册成为本管理平台用户前，请仔细阅读准入须知内容。一经激活本服务功能，则视为对本条款的全部认知和接受。请您仔细阅读：
    </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: "1.1em", fontWeight: 'bold', color: "#5B5B5B" }}>一、遵守诚实守信原则</h1>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', fontwWeight: 'bold' }}>
        承诺方在与“四川长虹电子控股集团有限公司”（以下简称“长虹公司”）进行认定和供货履行过程中，保证提供的资质证明（含特许经营）、执照、企业及个人简介资料、住所、产品名称、规格、品资、服务标准、票据、权证等资料均为真实，不存在虛假、欺瞒、伪造、编造行为。如上述相关情況发生变更，承诺方应在合理的时间尽快通知长虹公司，将诚信原则始终贯彻于交易合同履行的各阶段。
    </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: "1.1em", fontWeight: 'bold', color: "#5B5B5B" }}>二、遵守廉洁阳光原则</h1>
      <p style={{ marginLeft: "0em", textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）' }} >
        承诺方遵守《中华人民共和国反不正当竞争法》、《刑法》等有关禁止商业贿赂行为规定及长虹公司相关廉洁制度，坚决拒绝商业贿赂及其它不正当之商业行业的馈赠。不以任何名义向长虹公司员工及其配偶私下直接或间接赠送礼金、物品、有价证券或采取其他变相手段提供不正当利益；不为谋取不正当利益诱使长虹公司人员接受或共同编造虛假资料、影响交易价格或交易达成、违背职务、将合同权利义务转让给第三方及产生其它损害长虹公司利益的行为。承诺方同意抵制并向长虹公司揭露索贿和受贿人员的行径。
    </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: "1.1em", fontWeight: 'bold', color: "#5B5B5B" }}>三、遵守保密义务原则</h1>
      <p style={{ marginLeft: "0em", textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）' }} >
        <span > 3.1  </span>承诺方同意长虹公司依其保密制度所列机密资料，可包括一切关乎长虹公司，无论是否有价值、被公开、已经或正在采取保密措施的书面、口头或以其它形式呈现、保存的咨讯。上述机密资料包括长虹公司所有及其所管理的关联企业、客戶的机密资料，包括承诺方以合法途径、第三方途径、非正常途径所获得的。承诺方于接收机密资料后具有保密义务，未经长虹公司同意不得利用或向任何第三方泄露、交付。
    </p>
      <p style={{ marginLeft: "0em", textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）' }} >
        <span > 3.2  </span>承诺方及所属员工出入长虹公司須遵守路线、处所要求，不录音、拍照或摄像，不窃取或夾带任何资料文件，并接受长虹公司警卫监督检查的义务。
    </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: "1.1em", fontWeight: 'bold', color: "#5B5B5B" }}>四、遵守知识产权保护原则</h1>
      <p style={{ marginLeft: "0em", textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }} >
        承诺方在业务合作过程中，应积极维护长虹公司享有的各项知识产权及类似权益。不得为任何第三方生产，或向任何第三方销售任何侵犯长虹公司著作权、商标、专利、商号等知识产权或类似权益的产品。承诺方应当保证其提供商品的知识产权标记、标识符合法律、法规的规定；用户向长虹公司提供的商品标注知识产权标记、标识时，应当具备相应的证明权利合法有效的文件。接受第三方授权经营的，应当具备有效授权文件；确实不能提供授权文件的，应当具备所售商品合法来源的证明文件。
    </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: "1.1em", fontWeight: 'bold', color: "#5B5B5B" }}>五、遵守法律法规原则</h1>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        承诺方接受并严格遵守国家及地区“招标投标法”“合同法”、“安全生产法”、“环境保护法”等法律法规规定，在被明确告知的前提下，应遵守长虹公司及其各监管单位供应商管理、采购管理、招投标管理、合同管理、仓储管理等管理规定，并同时承诺其行为准则严格遵照因特网法规、政策、程序和惯例。不传输任何非法的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的和淫秽的信息资料；不传输任何教唆他人构成犯罪行为的资料；不传输助长国内不利条件和涉及国家安全的资料；不传输任何不符合当地法规、国家法律和国际法律的资料。未经许可禁止非法进入其它电脑系统。
    </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: "1.1em", fontWeight: 'bold', color: "#5B5B5B" }}>六、违约责任</h1>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        承诺方（包括但不限于其法定代表人、代理人及其员工）承诺遵守本承诺书的义务。如违反本承诺书所述任何义务，不论是否给长虹公司造成损失，长虹公司有权依实际发生的状况造成的影响或损失解除双方交易、将承诺方列入黑名单，并要求其赔偿等，且不需承担任何违约责任。承诺方应付的违约金、赔偿金，长虹公司有权从承诺方应付账款中抵扣，并可采取刑事控告等其它手段。
    </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: "1.1em", fontWeight: 'bold', color: "#5B5B5B" }}>七、免责条款</h1>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        <span > 7.1  </span>本网对任何因用户不正当或非法使用服务，或因用户发布言论、信息而产生的直接、间接、偶然、特殊及后续的损害不承担任何责任。
    </p>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        <span > 7.2  </span>本网对因不可抗力原因造成的服务中断或不能满足用户的要求及其他后果不承担任何责任。
    </p>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        <span > 7.3  </span>由于通信线路、网络、用户所在位置以及其他任何技术原因而导致用户不能接受本网服务时，本网不承担任何责任。
    </p>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        <span > 7.4  </span>对于因注册用户提交资料不准确或不及时更新其资料而给他人或自己造成的任何损失、影响及风险，本网不承担任何责任。
    </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: "1.1em", fontWeight: 'bold', color: "#5B5B5B" }}>八、申报条款</h1>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        <span > 8.1  </span>为保证采购业务的公平、公正、透明、规范，要求供应商与长虹公司员工存在利益关联关系的应提前申报。
    </p>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        <span > 8.2  </span>申报范围：包括配偶、子女及亲属，以及其他利益相关人（按照实质重于形式的原则，一般理性认为可能存在利益输送的关系紧密人，如同学、同乡、朋友等）。如有多名利益相关人需申报的，请分别列出姓名及关系。
    </p>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        <span > 8.3  </span>如发现供应商存在上述情况而未申报的，长虹公司有权终止其供应商资格。
    </p>
      <h1 style={{ fontFamily: '宋体（中文正文）', fontSize: "1.1em", fontWeight: 'bold', color: "#5B5B5B" }}>九、监察部门投诉举报热线</h1>
      <p style={{ textIndent: "2em", lineHeight: "1.5em", fontFamily: '宋体（中文正文）', }}>
        邮箱：CGJC@CHANGHONG.COM
    </p>
    </div>
  )
}
)
const CommonForm = create()(BaseAccountRef)

export default CommonForm