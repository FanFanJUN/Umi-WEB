/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2020-12-28 10:14:41
 * @LastEditors  : LiCai
 * @LastEditTime : 2020-12-30 17:50:05
 * @Description  : 批量导入
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/BatchImport/index.js
 */

import { Button, message, Modal, Popover, Row, Upload } from "antd";
import { Fragment, useState } from "react";
import { ExtTable } from "suid";
import ExportButtonRe from "./ExportButtonRe";
import moment from 'moment';

 const BatchImport = props => {
   const { columns, params, action, downLoadUrl, downMethod, callback, disabled } = props;

   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [visible, setVisible] = useState(false);
   const [dataSource, setDataSource] = useState([]);
   const [fileList, setFileList] = useState([]);
   const col  = [
    {
      title: '行号',
      dataIndex: 'reviewPlanYearLinenum',
      width: 80,
      ellipsis: true,
      align: 'center'
    },
    {
      title: '生产厂地址',
      dataIndex: 'address',
      ellipsis: true,
      width: 200,
      render: (v, data) => {
        return (
          `${data.countryName +
            data.provinceName +
            data.cityName +
            data.countyName +
            data.address}`.replace(/\s+/g, '')
        );
      },
    },
    {
      title: '供应商联系人',
      dataIndex: 'contactUserName',
      ellipsis: true,
      width: 140,
      align: 'center',
    },
    {
      title: '供应商联系电话',
      dataIndex: 'contactUserTel',
      ellipsis: true,
      width: 140,
      align: 'center',
    },
    { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 140 },
    { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 80 },
    {
      title: '预计审核月度',
      dataIndex: 'reviewMonth',
      ellipsis: true,
      width: 103,
      render: text => text && moment(text).format('YYYY-MM'),
      align: 'center',
    },
    { title: '专业组', dataIndex: 'specialtyTeamName', ellipsis: true, width: 140 },
    { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
  ];

   const checkCol = () => {
    return {
      title: '导入状态', dataIndex: 'importInfo', align: 'center', width: 130,
      render: (text, record) => {
          if (record.importStatus === true) {
              return "成功"
          } else if (record.importStatus === false) {
              return <Popover content={text}>
                  失败，<span>查看明细</span>
              </Popover>
          }
      }
  }
   }

   function toggleModal() {
     setDataSource([]);
     setVisible(!visible);
   }

   function handleOk() {
     if(dataSource.length === 0) {
       message.error('无数据可操作!');
       return;
     }
     const num = dataSource.filter((item) => {
       return item.importStatus === false
     }).length;
     if(num> 0) {
       message.error(`存在${num}条失败记录`);
       return;
     }
     callback(dataSource); //导入的回调事件
     toggleModal();
   }

   function beforeUpload (file) {
    let sindex = file.name.lastIndexOf(".");
    let ext = file.name.substring(sindex + 1, file.name.length);
    if (sindex < 0) {
        message.error("请上传excel文件");
        return false;
    } else {
        if (ext !== 'xls' && ext !== 'xlsx') {
            message.error("请上传excel文件");
            return false;
        }
    }
};

function handleChange(info) {
  // if (info.file.status === 'uploading') {
  //   setLoading(true);
  // }
  if (info.file.status === 'done') {
    setLoading(false);
    if (info.file.response.status === 'SUCCESS') {
      message.success(info.file.response.message);
      let data = info.file.response.data;
      setDataSource(data);
    } else if (info.file.response.status === 'FAILURE') {
      message.error(info.file.response.message);
    }
  } else if (info.file.status === 'error') {
    setLoading(false);
    message.error('上传失败');
  }
}

const getHeaders = () => {
  let auth;
  try {
      auth = JSON.parse(sessionStorage.getItem('Authorization'));
  } catch (e) {
  }
  return {
      'Authorization': auth ? (auth.accessToken ? auth.accessToken : '') : ''
  }
}

   const title = () => (
     <div>
       <Row>
         <Upload
           //   name={name} //发到后台的文件参数名
          //  data={params} //上传所需参数
           action={action} //上传的地址
           showUploadList={false}
           style={{ width: '100%' }}
          //  fileList={fileList}
           beforeUpload={beforeUpload}
           onChange={handleChange}
           headers={getHeaders()}
         >
           <Button style={{ marginLeft: 5 }} key="chooseFile" loading={loading}>
             选择文件
           </Button>
         </Upload>

         <ExportButtonRe
           type='primary'
           api={downLoadUrl}
           object={{}}
           params={params}
           fileName={'年度审核计划导入模板.xlsx'}
           method={downMethod}
           btnName={'模板下载'}
         />
       </Row>
     </div>
   );

   return (
     <Fragment>
       <Button style={{ marginLeft: '5px', marginRight: '15px' }} onClick={toggleModal} disabled={disabled}>
         批量导入
       </Button>
       <Modal
         width={'75%'}
         title="批量导入"
         centered
         destroyOnClose
         maskClosable={false}
         bodyStyle={{ padding: 12 }}
         visible={visible}
         confirmLoading={loading}
         onOk={handleOk}
         onCancel={toggleModal}
       >
         <div>
           <Row style={{ padding: 5 }}>{title()}</Row>
           <ExtTable
             style={{ marginTop: '10px' }}
             rowKey="reviewPlanYearLinenum"
             allowCancelSelect={true}
             showSearch={false}
             remotePaging
             size="small"
             columns={[checkCol(), ...col]}
             dataSource={dataSource}
           />
         </div>
       </Modal>
     </Fragment>
   );
 };

 export default BatchImport;