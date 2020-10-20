/**
 * 实现功能： 终止审批流组件
 * @author hezhi
 * @date 2020-10-15
 */
import styles from 'react';
import { Button, Modal, message } from 'antd';
import { utils } from 'suid';
import { FLOW_HOST } from '../../utils/constants';
const { request } = utils;
function createServiceRequest(option) {
  const {
    path: url,
    method = "POST",
    headers,
    params: data,
    base = '/',
    // 处理未按标准post请求处理接收参数的接口
    // 后端获取参数不是从post请求的body中获取，而是从url params中获取参数的接口将hack设置为true
    hack = false
  } = option
  const URI = `${base}${url}`
  return request({
    url: URI,
    method,
    headers,
    data,
    params: method === 'GET' ? data : hack ? data : null
  }).catch(error => {
    return ({
      ...error,
      message: '请求异常，请联系管理员'
    })
  })
}

const stopApproveRequest = params => createServiceRequest({
  path: `${FLOW_HOST}/flowInstance/checkAndEndByBusinessId`,
  params,
  base: '/api-gateway',
  hack: true
})


function StopApprove({
  businessId,
  onComplete = () => null,
  children = '终止审核',
  ...props
}) {
  async function handleClick() {
    Modal.confirm({
      title: '终止审批流程',
      content: '流程终止后无法恢复，是否继续？',
      onOk: async () => {
        const { success, message: msg } = await stopApproveRequest({ businessId });
        if (success) {
          message.success(msg)
          onComplete()
          return
        }
        message.error(msg)
      },
      okText: '确定',
      cancelText: '取消'
    })
  }
  return (
    <Button onClick={handleClick} {...props}>{children}</Button>
  )
}
export default StopApprove;