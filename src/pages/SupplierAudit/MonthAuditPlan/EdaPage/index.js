import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Affix, Button, Form, message, Spin, Modal } from 'antd';
import { WorkFlow } from 'suid';
import classnames from 'classnames';
import moment from 'moment';
import BaseInfo from './BaseInfo';
import styles from '../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserId, getUserName } from '@/utils';
import LineInfo from './LineInfo';
import ChangeInfo from '../component/ChangeInfo';
import { insertMonthBo, findOneOverride, upDateMonthBo, insertChangeMonthBo } from '../service';
import { checkToken } from '../../../../utils';

const { StartFlow } = WorkFlow;

const Index = (props) => {
  const { form, onRef } = props;
  const tableRef = useRef(null);
  const changeRef = useRef(null);
  const [data, setData] = useState({
    id: '',
    spinLoading: false,
    isView: false,
    type: 'add',
    title: '',
    userInfo: {},
  });
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const { query } = router.useLocation();

  useImperativeHandle(onRef, () => ({
    editDataInflow,
  }));

  async function editDataInflow() {
    const allData = getAllData();
    if (!allData) return false;
    const res = await upDateMonthBo({ ...allData, inFlow: true });
    return res;
  }

  useEffect(async () => {
    if (query.pageState !== 'add') {
      await getDetail();
    } else {
      await getData()
    }
  }, []);

  const getData = async(resData) => {
    const { id, pageState } = query;
    switch (pageState) {
      case 'add':
        getUser();
        setData((value) => ({ ...value, type: pageState, isView: false, title: '新增月度审核计划' }));
        break;
      case 'edit':
        getUser();
        setData((value) => ({
          ...value,
          type: pageState,
          id,
          isView: false,
          title: `编辑月度审核计划: ${resData && resData.reviewPlanMonthCode}`,
        }));
        break;
      case 'detail':
        setData((value) => ({
          ...value,
          type: pageState,
          isView: true,
          title: `月度审核计划明细: ${resData && resData.reviewPlanMonthCode}`,
        }));
        break;
      case 'change':
        setData((value) => ({
          ...value,
          type: pageState,
          isView: false,
          title: `变更月度审核计划: ${resData && resData.reviewPlanMonthCode}`,
        }));
        break;
      case 'isInflow':
        setData((value) => ({
          ...value,
          type: pageState,
          isView: true,
          title: `月度审核计划明细: ${resData && resData.reviewPlanMonthCode}`,
        }));
        break;
      default:
        setData((value) => ({ ...value, type: pageState, isView: false, title: '月度审核计划管理-新增' }));
        break;
    }
  }

  const getDetail = async () => {
    setLoading(true);
    let res = await findOneOverride({
      id: query.id,
    });
    setLoading(false);
    if (res) {
      setEditData(res.data);
      await getData(res.data)
    } else {
      message.error(res.message);
    }
  };

  const getUser = () => {
    const userId = getUserId();
    const userName = getUserName();
    const userMobile = getMobile();
    setData((v) => ({ ...v, userInfo: { userName, userId, userMobile } }));
  };

  const handleBack = () => {
    closeCurrent();
  };
  // 处理数据
  const getAllData = () => {
    let saveData = { ...editData };
    let lineData = tableRef.current.getTableList();
    console.log("获取到的表格数据", lineData);
    let deleteArr = tableRef.current.getDeleteArr();
    if (lineData.length === 0) {
      message.info('请至少添加一条行信息');
      return false;
    } else {
      // 校验审核原因，审核方式，审核组织形式不能为空
      let reviewPlanMonthLinenum = '';
      let tag = lineData.some(item => {
        console.log(item, 'item')
        // 记录行号
        if ((!item.reviewWayId || !item.reviewOrganizedWayId || !item.reviewReasonId) && !item.whetherDeleted) {
          reviewPlanMonthLinenum = item.reviewPlanMonthLinenum;
        }
        return (!item.reviewWayId || !item.reviewOrganizedWayId || !item.reviewReasonId) && !item.whetherDeleted;
      });
      if (tag) {
        message.error('行' + reviewPlanMonthLinenum + '：审核原因，审核方式，审核组织形式不能为空，请进行编辑完善');
        return false;
      }
    }
    // 变更时
    if (query.pageState === 'change') {
      const changeInfo = changeRef.current.getData();
      if (!changeInfo) {
        return false;
      } else {
        delete saveData.lineBoList;
        saveData.reviewPlanMonthLineChangeBos = lineData.concat(deleteArr).map((item, index) => {
          item.reviewPlanMonthLineId = item.id;
          delete item.id;
          item.reviewPlanMonthChangeLinenum = ((Array(4).join(0) + (index + 1)).slice(-4) + '0');
          return item;
        });
        Object.assign(saveData, changeInfo);
        return saveData;
      }
    } else {
      let baseInfo = {};
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          baseInfo = false;
        } else {
          values.applyMonth = moment(values.applyMonth).format('YYYY-MM-DD').slice(0, 7) + '-01';
          // console.log("表单数据", values)
          baseInfo = { ...values };
        }
      });
      if (!baseInfo) return false;
      Object.assign(saveData, baseInfo);
      saveData.lineBoList = lineData;
      saveData.deleteList = deleteArr;
      if (!saveData.attachRelatedIds) {
        saveData.attachRelatedIds = [];
      }
      return saveData;
    }
  };
  // 新增保存，编辑保存，变更保存
  const handleSave = async (type) => {
    let saveData = await getAllData();
    // console.log("整合的数据", saveData)
    if (!saveData) return false;
    setLoading(true);
    let res = {};
    const requestPromise = {
      'add': insertMonthBo,
      'edit': upDateMonthBo,
      'change': insertChangeMonthBo,
    };
    // 请求错误时 success值同样为 true  catch 重新赋值
    try {
      res = await requestPromise[query.pageState](saveData);
    } catch (error) {
      res = error;
      setLoading(false);
    }
    if (res.success) {
      if (type === 'save') {
        message.success('保存成功');
        setTimeout(() => {
          handleBack();
        }, 1000);
      } else {
        // 处理提交审核---返回数据id
        return { id: res.data, message: '保存成功' };
      }
    } else {
      setLoading(false);
      if (type === 'save') {
        message.error(res.message);
      } else {
        return { id: false, message: res.message };
      }
    }
  };
  // 提交审核验证
  const handleBeforeStartFlow = async () => {
    const res = await handleSave('publish');
    return new Promise(function(resolve, reject) {
      if (res.id) {
        resolve({
          success: data,
          message: '保存成功',
          data: {
            businessKey: res.id,
          },
        });
        return;
      } else {
        setTimeout(() => {
          let closeBtns = document.getElementsByClassName('close-icon');
          for (let i = 0; i < closeBtns.length; i++) {
            closeBtns[i].click();
          }
        }, 1000);
        reject({
          success: data,
          message: res.message,
        });
      }
    });
  };

  // 提交审核完成更新列表
  function handleComplete() {
    setLoading(false);
    message.success('提交成功');
    setTimeout(() => {
      handleBack();
    }, 1000);
  }

  return <>
    <Spin spinning={loading}>
      <Affix>
        <div className={classnames(styles.fbc, styles.affixHeader)}>
          <span style={{ fontSize: '18px', fontWeight: 'bolder' }}>{data.title}</span>
          {
            props.isInFlow !== 1 && (data.type === 'add' || data.type === 'change' || data.type === 'edit') &&
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button className={styles.btn} onClick={handleBack}>返回</Button>
              <Button className={styles.btn} onClick={() => handleSave('save')}>暂存</Button>
              <StartFlow
                className={styles.btn}
                type='primary'
                beforeStart={handleBeforeStartFlow}
                startComplete={handleComplete}
                onCancel={() => {
                  setLoading(false);
                  handleBack();
                }}
                businessKey={query?.id}
                disabled={loading}
                businessModelCode={data.type === 'change' ? 'com.ecmp.srm.sam.entity.sr.ReviewPlanMonthChange' : 'com.ecmp.srm.sam.entity.sr.ReviewPlanMonth'}
              >
                {
                  loading => <Button loading={loading} type='primary'>提交</Button>
                }
              </StartFlow>
            </div>
          }
        </div>
      </Affix>
      {
        data.type === 'change' && <ChangeInfo
          originData={{}}
          isView={false}
          wrappedComponentRef={changeRef}
        />
      }
      <BaseInfo
        form={form}
        userInfo={data.userInfo}
        type={data.type}
        isView={data.isView}
        originData={editData}
      />
      <LineInfo
        type={data.type}
        pageState={query.pageState}
        isView={data.isView}
        wrappedComponentRef={tableRef}
        originData={editData.lineBoList}
      />
    </Spin>
  </>;
};
export default Form.create()(Index);
