/* eslint-disable react/no-unused-state */
import React from 'react';
import { MultiGrid, AutoSizer } from 'react-virtualized';
import { Checkbox, Empty, Spin } from 'antd';
import clx from 'classnames';
import { get, throttle } from 'lodash';
import PropTypes from 'prop-types';
// import { Resizable } from 'react-resizable';
// import 'react-resizable/css/styles.css';
import './index.less';

class VirtualTable extends React.PureComponent { 
  constructor(props) {
    super(props);
    const { data = [], columns = [], onSelectRow } = props;
    let newCols = [...columns];
    if (onSelectRow) {
      newCols = [
        {
          dataIndex: 'selected',
          title: 1,
          width: 36,
          resizable: false,
          render: this.renderSelectCol,
        },
      ].concat(columns);
    }
    const columnsWidth = newCols.map(c => c.width || 220);
    this.selectedRowKeys = [];
    this.state = {
      dataSource: data,
      columns: newCols,
      columnsWidth,
      selectedRows: [],
    };
    this.forceUpdateGrids = throttle(this.forceUpdateGrids, 500);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data = [] } = nextProps;
    const { dataSource = [] } = prevState;
    if (data !== prevState.dataSource || data.length !== dataSource.length) {
      return { dataSource: data };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // const { dataSource = [] } = prevState;
    // const { dataSource: currentData = [] } = this.state;
    // if (dataSource !== currentData || currentData.length !== dataSource.length) {
    if (this.grid) {
      this.grid.forceUpdateGrids();
    }
    // }
  }

  forceUpdateGrids = () => {
    if (this.grid) {
      this.grid.forceUpdateGrids();
    }
  };

  renderSelectCol = (text, item, index) => {
    const { onSelectRow, selectedRows = [] } = this.props;
    const rowKey = this._getRowKey(item);
    return (
      <div style={{ padding: '0 5px' }}>
        <Checkbox
          checked={this.selectedRowKeys.indexOf(rowKey) > -1}
          onChange={({ target: { checked } }) => {
            if (checked) {
              this.selectedRowKeys.push(rowKey);
              selectedRows.push(item);
              this.setState({ selectedRows }, () => {
                if (onSelectRow) {
                  onSelectRow(selectedRows);
                }
                setTimeout(() => {
                  if (this.grid) {
                    this.grid.forceUpdate();
                    this.grid.forceUpdateGrids();
                  }
                });
              });
            } else {
              const inx = this.selectedRowKeys.indexOf(rowKey);
              this.selectedRowKeys.splice(inx, 1);
              selectedRows.splice(inx, 1);
              this.setState({ selectedRows }, () => {
                if (onSelectRow) {
                  onSelectRow(selectedRows);
                }
                setTimeout(() => {
                  if (this.grid) {
                    this.grid.forceUpdate();
                    this.grid.forceUpdateGrids();
                  }
                });
              });
            }
          }}
        />
      </div>
    );
  };

  _getNoContent = () => <Empty />;

  _getRowKey = item => {
    const { rowKey } = this.props;
    let key = rowKey;
    if (typeof rowKey === 'function') {
      key = rowKey(item);
    } else if (typeof rowKey === 'string') {
      key = item[rowKey];
    } else {
      key = item.key;
    }
    return key;
  };

  _getColumnsWidth = ({ index }) => {
    const { columnsWidth = [] } = this.state;
    return columnsWidth[index];
  };

  _getFlexedRows = () => {
    const { columns = [] } = this.state;
    let inx = 0;
    let start = true;
    columns.forEach(i => {
      if (start) {
        if (i.fixed && i.fixed !== 'right') {
          inx += 1;
        } else {
          start = false;
        }
      }
    });
    return inx;
  };

  onResize = (columnIndex, { size }) => {
    const { width } = size;
    const { columnsWidth } = this.state;
    columnsWidth[columnIndex] = width;
    this.setState({ columnsWidth: [...columnsWidth] });
  };

  headerRender = ({ columnIndex, key, style }) => {
    const { columns = [], columnsWidth = [], dataSource = [] } = this.state;
    const column = columns[columnIndex] || {};
    const { dataIndex, key: ColumnKey, className, align, resizable } = column;
    let { title } = column;
    const width = columnsWidth[columnIndex];
    const { onSelectRow } = this.props;
    if (onSelectRow && columnIndex === 0) {
      const indeterminate =
        this.selectedRowKeys.length && dataSource.length !== this.selectedRowKeys.length;
      title = (
        <div style={{ padding: '0 6px' }}>
          <Checkbox
            onChange={({ target: { checked } }) => {
              if (checked) {
                this.selectedRowKeys = dataSource.map(this._getRowKey);
                this.setState({ selectedRows: dataSource }, () => {
                  if (onSelectRow) {
                    onSelectRow(dataSource);
                  }
                  setTimeout(() => {
                    if (this.grid) {
                      this.grid.forceUpdate();
                      this.grid.forceUpdateGrids();
                    }
                  });
                });
              } else {
                this.selectedRowKeys = [];
                this.setState({ selectedRows: [] }, () => {
                  if (onSelectRow) {
                    onSelectRow([]);
                  }
                  setTimeout(() => {
                    if (this.grid) {
                      this.grid.forceUpdate();
                      this.grid.forceUpdateGrids();
                    }
                  });
                });
              }
            }}
            indeterminate={indeterminate}
            checked={this.selectedRowKeys.length}
          />
        </div>
      );
    }

    if (dataIndex || ColumnKey) {
      /*if (resizable) {
        // TODO::列宽拖动
        return (
          <Resizable
            width={width}
            height={0}
            handle={resizeHandle => (
              <span
                className={`react-resizable-handle react-resizable-handle-${resizeHandle}`}
                onClick={e => {
                  e.stopPropagation();
                }}
              />
            )}
            onResize={(e, props) => this.onResize(columnIndex, props)}
            draggableOpts={{ enableUserSelectHack: false }}
          >
            <div
              key={key}
              style={style}
              className={clx('headerCell', className, {
                ['center']: align === 'center',
                ['left']: align === 'left',
                ['right']: align === 'right',
              })}
            >
              <div className={'container'}>
                <span className={'text'}>{title}</span>
              </div>
            </div>
          </Resizable>
        );
      }*/
      return (
        <div
          key={key}
          style={style}
          className={clx('headerCell', className, {
            ['center']: align === 'center',
            ['left']: align === 'left',
            ['right']: align === 'right',
          })}
        >
          <div className={'container'}>
            <span className={'text'}>{title}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    if (rowIndex === 0) {
      return this.headerRender({ columnIndex, key, style });
    }
    const { columns = [], dataSource = [] } = this.state;
    const { dataIndex, key: columnKey, render } = columns[columnIndex] || {};
    const rowItem = dataSource[rowIndex - 1];
    const rowKey = this._getRowKey(rowItem);
    const text = get(rowItem, dataIndex || columnKey);
    const odd = !!((rowIndex - 1) % 2);
    const selected = this.selectedRowKeys.indexOf(rowKey) > -1;
    if (render) {
      const node = render(text, rowItem, rowIndex - 1);
      return (
        <div
          key={key}
          style={style}
          className={clx('cell', {
            ['odd']: odd,
            ['even']: !odd,
            ['selected']: selected,
          })}
        >
          <div className={'container'}>
            <div className={'contentText'}>{node}</div>
          </div>
        </div>
      );
    }
    return (
      <div
        key={key}
        style={style}
        className={clx('cell', {
          ['odd']: odd,
          ['even']: !odd,
          ['selected']: selected,
        })}
      >
        <div className={'container'}>
          <div className={'contentText'}>{text}</div>
        </div>
      </div>
    );
  };

  render() {
    const {
      width: propsWidth,
      height: propsHeight,
      rowHeight = 58.6,
      headerHeight = 36.8,
      loading = false,
      fixedHeader = true,
    } = this.props;
    const { dataSource = [], columns = [], columnsWidth = [] } = this.state;
    const flexColumns = this._getFlexedRows();
    const allColWid = columnsWidth.reduce((a, b) => a + b, 0);
    return (
      <AutoSizer style={{ height: 'unset', width: 'unset' }}>
        {({ width, height }) => {
          let w = propsWidth || width;
          let h = propsHeight || height;
          if (!width) {
            w = 1320;
          }
          if (!height) {
            h = 720;
          }
          if (loading) {
            return (
              <div style={{ width: w, height: h, textAlign: 'center', lineHeight: `${h}px` }}>
                <Spin spinning size="large" />
              </div>
            );
          }
          return (
            <MultiGrid
              estimatedColumnSize={allColWid}
              noContentRenderer={this._getNoContent}
              ref={ref => {
                this.grid = ref;
              }}
              tabIndex={-1}
              className="BodyGrid"
              columnCount={columns.length}
              columnWidth={this._getColumnsWidth}
              fixedColumnCount={flexColumns}
              fixedRowCount={fixedHeader ? 1 : 0}
              height={h}
              scrollingResetTimeInterval={1}
              cellRenderer={this.cellRenderer}
              rowCount={dataSource.length + 1}
              rowHeight={
                ({ index }) => (index === 0 ? headerHeight : rowHeight) // 数据量 + 表头
              }
              width={w}
              enableFixedRowScroll
              hideTopRightGridScrollbar
            />
          );
        }}
      </AutoSizer>
    );
  }
}

VirtualTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

VirtualTable.defaultProps = {
  loading: false,
};

export default VirtualTable;
