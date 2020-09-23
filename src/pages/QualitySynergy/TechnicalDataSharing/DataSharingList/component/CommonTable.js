import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Pagination, message, Table, Input } from 'antd';
import { request } from 'suid/es/utils';

const { Search } = Input;

export const CommonTable = React.forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    manualSelectedRows: manualSelectedRows
  }))

  const { columns, dataSource, store } = props;

  const [pageInfo, setPageInfo] = useState({
    page: 1,
    rows: 30,
  });

  const manualSelectedRows = () => {
    setData(v => ({...v, selectedRowRows: [], selectedRowKeys: []}))
  }

  const [data, setData] = useState({
    selectedRowKeys: [],
    selectedRowRows: [],
    loading: false,
    dataSource: [],
    total: 0,
    quickValue: '',
  });

  const onChange = (keys, rows) => {
    setData(v => ({ ...v, selectedRowKeys: keys, selectedRowRows: rows }));
    props.onSelectRow(keys, rows)
  };

  useEffect(() => {
    if (store) {
      getDataSource();
    } else {
      setData(dataSource);
    }
  }, []);

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    setPageInfo({
      page: current,
      rows: pageSize,
    });
  };

  const getDataSource = (quickValue) => {
    setData(v => ({ ...v, loading: true }));
    const { url, type, params } = store;
    const allParams = {
      pageInfo,
      quickValue: quickValue ? quickValue : '',
      ...params,
    };
    request(url, {
      method: type,
      data: allParams,
    }).then(res => {
      if (res.success) {
        setData(v => ({ ...v, dataSource: res.data.rows, total: res.data.records, loading: false }));
      } else {
        setData(v => ({ ...v, loading: false }));
        message.error(res.message);
      }
    });
  };

  useEffect(() => {
    getDataSource()
  }, [pageInfo])


  const onPageChange = (value) => {
    setPageInfo(v => ({...v, page: value}))
  }

  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Search
        style={{ width: 200, marginBottom: '5px' }}
        placeholder="请输入代码或名称"
        onSearch={value => {
          getDataSource(value);
        }}
      />
    </div>
    <div style={{ height: '100%', display: 'flex' }}>
      <Table
        loading={data.loading}
        filterMultiple={true}
        onRow={(record, index) => {
          return {
            onClick: () => {
              let oldSelectedRowKeys = data.selectedRowKeys.slice()
              let oldSelectedRowRows = data.selectedRowRows.slice()
              if (oldSelectedRowKeys.some(item => item === record.id)) {
                oldSelectedRowKeys.forEach((item, index) => {
                  if (item === record.id) {
                    oldSelectedRowKeys.splice(index, 1)
                    oldSelectedRowRows.splice(index, 1)
                  }
                })
                setData(v => ({ ...v, selectedRowKeys: oldSelectedRowKeys, selectedRowRows: oldSelectedRowRows}));
              } else {
                props.onSelectRow([...data.selectedRowKeys, record.id], [...data.selectedRowRows, record])
                setData(v => ({ ...v, selectedRowKeys: [...data.selectedRowKeys, record.id], selectedRowRows: [...data.selectedRowRows, record]}));
              }
            },
          };
        }}
        scroll={{
          y: 400,
        }}
        rowSelection={{
          hideSelectAll: true,
          selectedRowKeys: data.selectedRowKeys,
          onChange: onChange,
        }}
        rowKey={v => v.id}
        pagination={false}
        size={'small'}
        columns={columns}
        dataSource={data.dataSource}
      />
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
      <Pagination
        showTotal={(total, range) => `${data.selectedRowKeys?.length === 0 ? '' : `已选 ${data.selectedRowKeys?.length} 条 `}显示 ${range[0]}-${range[1]} 共 ${total} 条`}
        current={pageInfo.page}
        total={data.total}
        pageSizeOptions={[
          '30',
          '50',
          '100',
        ]}
        showSizeChanger
        defaultPageSize={30}
        onChange={onPageChange}
        onShowSizeChange={onShowSizeChange}/>
    </div>
  </div>;
})
