import React, { useEffect, useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import { Button, Input, Upload, message } from 'antd';
import { getRandom } from '../../../QualitySynergy/commonProps';
import { getDocIdForArray } from '@/utils/utilTool';
import {
  ResultsEntryApi,
  SaveResultsEntryApi, SubmitResultsEntryApi,
} from '../commonApi';
import { recommendUrl } from '../../../../utils/commonUrl';
import ProblemTable from './component/ProblemTable';
import { BASE_URL } from '../../../../utils/constants';

const ResultsEntry = (props) => {

  const [data, setData] = useState({
    dataSource: [],
  });

  const [updateLoading, setUpdateLoading] = useState(false);

  const [fileList, setFileList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [butLoading, setButLoading] = useState(false);

  useEffect(() => {
    if (props.visible) {
      getTableData(props.id);
    }
  }, [props.visible]);

  const getTableData = (reviewImplementManagementId) => {
    setLoading(true);
    ResultsEntryApi({ reviewImplementManagementId }).then(res => {
      if (res.success) {
        let newData = JSON.parse(JSON.stringify(res.data));
        newData = newData.map(item => ({
          ...item,
          lineNum: getRandom(10),
          attachRelatedIds: getDocIdForArray(item.fileList),
        }));
        setData(v => ({ ...v, dataSource: newData }));
        setLoading(false);
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
  };


  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = (type) => {
    setButLoading(true);
    const servers = type === 'save' ? SaveResultsEntryApi : SubmitResultsEntryApi;
    servers(data.dataSource).then(res => {
      if (res.success) {
        setButLoading(false);
        message.success('保存成功');
        props.onOk();
      } else {
        setButLoading(false);
        message.error(res.message);
      }
    }).catch(err => {
      setButLoading(false);
      message.error(err.message);
    });
  };

  const clearSelected = () => {
    setData(v => ({ ...v, dataSource: [] }));
  };

  // 导出数据
  const exportData = () => {
    const url = `/service.api/${recommendUrl}/srController/downloadResultTemplate?reviewImplementManagementId=${props.id}`;
    window.open(url);
  };

  const onChange = (value) => {
    console.log('触发');
    setData(v => ({ ...v, dataSource: value }));
  };

  // 文件上传之前(判断选中文件格式并封装fileList)
  const beforeUpload = (file) => {
    let sindex = file.name.lastIndexOf('.');
    let ext = file.name.substring(sindex + 1, file.name.length);
    if (sindex < 0) {
      message.error('请上传excel文件');
    } else {
      if (ext !== 'xls' && ext !== 'xlsx') {
        message.error('请上传excel文件');
      } else {
        setFileList([...fileList, file]);
        console.log('fileList', file);
      }
    }
  };

  // 选择文件上传后返回的状态
  const handleChange = (res) => {
    const { status, response } = res.file;
    if (status === 'uploading') {
      setUpdateLoading(true);
    }
    if (status === 'done') {
      if (response.status === 'SUCCESS') {
        let newData = JSON.parse(JSON.stringify(response.data));
        let newDataSource = JSON.parse(JSON.stringify(data.dataSource));
        newData.map((item) => {
          newDataSource.map((value, index) => {
            if (value.id === item.id) {
              newDataSource[index] = ({
                ...value,
                whetherApply: item.whetherApply,
                reviewScore: item.reviewScore,
                remark: item.remark,
              });
            }
          });
        });
        setData(v => ({ ...v, dataSource: newDataSource }));
        console.log(newDataSource, '导入的数据');
        setUpdateLoading(false);
      } else if (response.status === 'FAILURE') {
        message.error(response.message);
        setUpdateLoading(false);
      }
    } else if (status === 'error') {
      setUpdateLoading(false);
      message.error('上传失败');
    }
  };

  return (
    <ExtModal
      width={'180vh'}
      maskClosable={false}
      visible={visible}
      title={'结果录入'}
      onCancel={onCancel}
      destroyOnClose={true}
      afterClose={clearSelected}
      footer={<div>
        <Button onClick={onCancel}>取消</Button>
        <Button type={'primary'} onClick={() => onOk('save')} loading={butLoading}>暂存</Button>
        <Button onClick={() => onOk('submit')} loading={butLoading}>提交</Button>
      </div>}
    >
      <div>
        <Upload
          name="file"
          beforeUpload={beforeUpload}
          showUploadList={false}
          fileList={fileList}
          action={window.location.origin + BASE_URL + `${recommendUrl}/srController/importResult`}
          data={{
            reviewImplementManagementId: props.id,
          }}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          <Button type='primary' style={{ marginLeft: 5 }} key="chooseFile" loading={updateLoading}>
            批量录入
          </Button>
        </Upload>
        <Button style={{ marginLeft: '5px' }} key="downLoad" onClick={exportData}>批量导出</Button>
      </div>
      <ProblemTable
        loading={loading}
        onChange={onChange}
        dataSource={data.dataSource}
      />
    </ExtModal>
  );

};
export default ResultsEntry;
