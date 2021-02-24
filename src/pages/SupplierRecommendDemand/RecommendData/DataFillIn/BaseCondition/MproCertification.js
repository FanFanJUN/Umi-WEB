/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 13:47:57
 * @LastEditTime: 2020-09-23 13:52:30
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/MproCertification.js
 * @Description: 管理体系及产品认证
 * @Connect: 1981824361@qq.com
 */
import { Fragment } from 'react';
import { Divider, message } from 'antd';
import EditorTable from '../../../../../components/EditorTable';
import styles from '../index.less'

const MproCertification = ({
  type,
  setUpTime = null,
  proData = [],
  setProData = () => null,
  otherData = [],
  setOtherData = () => null,
  manageData = [],
  setManageData = () => null
}) => {
  const manFields = [
    {
      label: '是否取得',
      name: 'obtained',
      fieldType: 'select',
      options: {
        rules: [
          {
            required: true,
            message: '请选择是否取得'
          }
        ]
      },
      props: {
        placeholder: '请选择是否取得'
      },
      changeResetFields: [
        'certificateType',
        'executiveStandard',
        'certificateNumber',
        'certifyingAuthority',
        'firstObtainTime',
        'validDate',
        'planObtainTime',
        'attachmentIds'
      ]
    },
    {
      label: '管理体系',
      name: 'certificateName',
      props: {
        disabled: true
      },
      options: {
        rules: [
          {
            required: true,
            message: '管理体系不能为空'
          }
        ]
      }
    },
    {
      label: '认证类型',
      name: 'certificateType',
      options: {
        rules: [
          {
            required: (tv) => !!tv,
            message: '认证类型不能为空'
          }
        ]
      },
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '执行标准',
      name: 'executiveStandard',
      options: {
        rules: [
          {
            required: (tv) => !!tv,
            message: '执行标准不能为空'
          }
        ]
      },
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '证件编号',
      name: 'certificateNumber',
      options: {
        rules: [
          {
            required: (tv) => !!tv,
            message: '证件编号不能为空'
          }
        ]
      },
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '发证机构',
      name: 'certifyingAuthority',
      options: {
        rules: [
          {
            required: (tv) => !!tv,
            message: '发证机构不能为空'
          }
        ]
      },
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '首次获证时间',
      name: 'firstObtainTime',
      fieldType: 'datePicker',
      options: {
        rules: [
          {
            required: (tv) => !!tv,
            message: '请选择首次获证时间'
          }
        ]
      },
      disabledDate: (ct) => {
        return ct < setUpTime
      },
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '有效期间',
      name: 'validDate',
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => !tv
      },
      options: {
        rules: [
          {
            required: (tv) => !!tv,
            message: '有效期间不能为空'
          }
        ]
      }
    },
    {
      label: '附件',
      name: 'attachmentIds',
      fieldType: 'uploadFile',
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => !tv
      },
      options: {
        rules: [
          {
            required: (tv) => !!tv,
            message: '附件不能为空'
          }
        ]
      }
    },
    {

      label: '计划取得时间',
      name: 'planObtainTime',
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => tv
      },
      width: 150
    },
  ]
  const columnsForMan = [
    {
      title: '是否取得',
      dataIndex: 'obtained',
      render(text) {
        return Object.is(null, text) ? '' : text ? '是' : '否'
      }
    },
    {
      title: '管理体系',
      dataIndex: 'certificateName'
    },
    {
      title: '认证类型',
      dataIndex: 'certificateType'
    },
    {
      title: '执行标准',
      dataIndex: 'executiveStandard'
    },
    {
      title: '证件编号',
      dataIndex: 'certificateNumber'
    },
    {
      title: '发证机构',
      dataIndex: 'certifyingAuthority'
    },
    {

      title: '首次获证时间',
      dataIndex: 'firstObtainTime',
      type: 'date',
      width: 150
    },
    {
      title: '有效期间',
      dataIndex: 'validDate'
    },
    {
      title: '附件',
      dataIndex: 'attachmentIds',
      type: 'uploadFile'
    },
    {

      title: '计划取得时间',
      dataIndex: 'planObtainTime',
      type: 'date',
      width: 150
    },
  ].map(item => ({
    ...item,
    align: 'center'
  }));
  const proFields = [
    {
      label: '产品',
      name: 'productName',
      props: {
        disabled: true
      },
      options: {
        rules: [
          {
            required: true,
            message: '产品不能为空'
          }
        ]
      },
      changeResetFields: [
        'certificateType',
        'executiveStandard',
        'certificateNumber',
        'certifyingAuthority',
        'firstObtainTime',
        'newestAnnualReview',
        'attachmentIds',
        'planObtainTime'
      ]
    },
    {
      label: '是否取得',
      name: 'obtained',
      props: {
        placeholder: '请选择是否取得'
      },
      options: {
        rules: [
          {
            required: true,
            message: '请确认是否取得'
          }
        ]
      },
      fieldType: 'select'
    },
    {
      label: '认证类型',
      name: 'certificateType',
      fieldType: 'select',
      selectOptions: [
        {
          value: '安规认证',
          name: '安规认证'
        },
        {
          value: 'EMC认证',
          name: 'EMC认证'
        }
      ],
      disabledTarget: 'obtained',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '请选择认证类型'
          }
        ]
      },
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '执行标准',
      name: 'executiveStandard',
      disabledTarget: 'obtained',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '执行标准不能为空'
          }
        ]
      },
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '证件编号',
      name: 'certificateNumber',
      disabledTarget: 'obtained',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '证件编号不能为空'
          }
        ]
      },
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '发证机构',
      name: 'certifyingAuthority',
      disabledTarget: 'obtained',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '发证机构不能为空'
          }
        ]
      },
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '首次获证时间',
      name: 'firstObtainTime',
      type: 'date',
      fieldType: 'datePicker',
      disabledTarget: 'obtained',
      changeResetFields: ['newestAnnualReview'],
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '首次获证时间不能为空'
          }
        ]
      },
      disabledDate: (ct) => {
        return ct < setUpTime
      },
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '最新年审',
      name: 'newestAnnualReview',
      type: 'date',
      fieldType: 'datePicker',
      disabledTarget: 'obtained',
      otherTargetFields: ['firstObtainTime'],
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '最新年审不能为空'
          }
        ]
      },
      disabledDate: (ct, mn, tv, otherTv) => {
        return ct < otherTv['firstObtainTime']
      },
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '附件',
      name: 'attachmentIds',
      fieldType: 'uploadFile',
      disabledTarget: 'obtained',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '附件不能为空'
          }
        ]
      },
      props: {
        disabled: (tv) => !tv
      }
    },
    {
      label: '计划取得时间',
      name: 'planObtainTime',
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => !!tv
      }
    }
  ]
  const columnsForPro = [
    {
      title: '产品',
      dataIndex: 'productName'
    },
    {
      title: '是否取得',
      dataIndex: 'obtained',
      render(text) {
        return Object.is(null, text) ? '' : text ? '是' : '否'
      }
    },
    {
      title: '认证类型',
      dataIndex: 'certificateType'
    },
    {
      title: '执行标准',
      dataIndex: 'executiveStandard'
    },
    {
      title: '证件编号',
      dataIndex: 'certificateNumber'
    },
    {
      title: '发证机构',
      dataIndex: 'certifyingAuthority'
    },
    {
      title: '首次获证时间',
      dataIndex: 'firstObtainTime',
      type: 'date',
      inputType: 'DatePicker'
    },
    {
      title: '最新年审',
      dataIndex: 'newestAnnualReview',
      type: 'date',
      inputType: 'DatePicker'
    },
    {
      title: '附件',
      dataIndex: 'attachmentIds',
      type: 'uploadFile'
    },
    {

      title: '计划取得时间',
      dataIndex: 'planObtainTime'
    }
  ].map(item => ({
    ...item,
    align: 'center'
  }));
  const otherFields = [
    {
      label: '产品',
      name: 'productName',
      options: {
        rules: [
          {
            required: true,
            message: '产品不能为空'
          }
        ]
      },
      props: {
        disabled: true
      }
    },
    {
      label: '是否取得',
      name: 'obtained',
      props: {
        placeholder: '请选择是否取得'
      },
      options: {
        rules: [
          {
            required: true,
            message: '请确认是否取得'
          }
        ]
      },
      fieldType: 'select',
      changeResetFields: [
        'certificateType',
        'executiveStandard',
        'certificateNumber',
        'certifyingAuthority',
        'firstObtainTime',
        'newestAnnualReview',
        'attachmentIds',
        'planObtainTime'
      ]
    },
    {
      label: '认证类型',
      name: 'certificateType',
      fieldType: 'select',
      selectOptions: [
        {
          value: '安规认证',
          name: '安规认证'
        },
        {
          value: 'EMC认证',
          name: 'EMC认证'
        }
      ],
      options: {
        rules: [
          {
            required: true,
            message: '请选择认证类型'
          }
        ]
      }
    },
    {
      label: '执行标准',
      name: 'executiveStandard',
      disabledTarget: 'obtained',
      options: {
        rules: [
          {
            required: true,
            message: '执行标准不能为空'
          }
        ]
      }
    },
    {
      label: '证件编号',
      name: 'certificateNumber',
      disabledTarget: 'obtained',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '证件编号不能为空'
          }
        ]
      }
    },
    {
      label: '发证机构',
      name: 'certifyingAuthority',
      disabledTarget: 'obtained',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '发证机构不能为空'
          }
        ]
      }
    },
    {
      label: '首次获证时间',
      name: 'firstObtainTime',
      type: 'date',
      fieldType: 'datePicker',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '首次获证时间不能为空'
          }
        ]
      },
      disabledDate: (ct) => {
        return ct < setUpTime
      }
    },
    {
      label: '最新年审',
      name: 'newestAnnualReview',
      type: 'date',
      fieldType: 'datePicker',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '最新年审不能为空'
          }
        ]
      },
      disabledDate: (ct) => {
        return ct < setUpTime
      }
    },
    {
      label: '附件',
      name: 'attachmentIds',
      fieldType: 'uploadFile',
      disabledTarget: 'obtained',
      options: {
        rules: [
          {
            required: tv => !!tv,
            message: '附件不能为空'
          }
        ]
      }
    },
    {
      label: '计划取得时间',
      name: 'planObtainTime',
      disabledTarget: 'obtained',
      props: {
        disabled: (tv) => tv
      },
      width: 150
    }
  ]
  const columnsForOther = [
    {
      title: '产品',
      dataIndex: 'productName'
    },
    {
      title: '认证类型',
      dataIndex: 'certificateType'
    },
    {
      title: '执行标准',
      dataIndex: 'executiveStandard'
    },
    {
      title: '证件编号',
      dataIndex: 'certificateNumber'
    },
    {
      title: '发证机构',
      dataIndex: 'certifyingAuthority'
    },
    {

      title: '首次获证时间',
      dataIndex: 'firstObtainTime',
      width: 150
    },
    {
      title: '最新年审',
      dataIndex: 'newestAnnualReview',
      type: 'date',
    },
    {
      title: '附件',
      dataIndex: 'attachmentIds',
      type: 'uploadFile'
    },
    {

      title: '计划取得时间',
      dataIndex: 'planObtainTime',
      type: 'date',
      width: 150
    },
  ].map(item => ({ ...item, align: 'center' }));
  function handleManTableEditor() {
    return new Promise((resolve, reject) => {
      if (!!setUpTime) {
        resolve()
        return
      }
      message.error('请先在基本信息中填写成立时间')
      reject('未填写成立时间')
    })
  }
  return <Fragment>
    <div>
      <Divider orientation='left'>管理体系（至少填写质量管理体系）</Divider>
      <EditorTable
        columns={columnsForMan}
        fields={manFields}
        allowRemove={false}
        allowCreate={false}
        beforeEditor={handleManTableEditor}
        rowKey='guid'
        setDataSource={setManageData}
        dataSource={manageData}
      />
      <Divider orientation='left'>产品安规或EMC认证<span className={styles.hint}>(至少填写一行数据)</span></Divider>
      <EditorTable
        fields={proFields}
        columns={columnsForPro}
        rowKey='guid'
        setDataSource={setProData}
        copyLine={true}
        dataSource={proData}
      />
      <Divider orientation='left'>其他认证</Divider>
      <EditorTable
        fields={otherFields}
        columns={columnsForOther}
        copyLine={true}
        rowKey='guid'
        dataSource={otherData}
        setDataSource={setOtherData}
      />
    </div>
  </Fragment>
}

export default MproCertification;