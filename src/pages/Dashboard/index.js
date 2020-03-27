import React, { Component } from 'react';
import { Icon, Menu,Layout} from 'antd';
import Link from 'umi/link';
import cls from 'classnames';
import { ScrollBar } from 'suid';
import styles from './index.less';
import routes from '../../../config/router.config.js';

const { Header, Content, }=Layout;
const { SubMenu } = Menu;

const getIcon = (icon) => {
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export default class Home extends Component {

  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter((item) => item.title)
      .map((item) => this.getSubMenuOrItem(item))
      .filter((item) => item);
  };

  getSubMenuTitle = (item) => {
    const { title } = item;
    return item.icon ? (
      <span>
        {getIcon(item.icon)}
        <span>{title}</span>
      </span>
    ) : (
      title
    );
  };

  getSubMenuOrItem = (item) => {
    if (item.routes && item.routes.some((child) => child.title)) {
      return (
        <SubMenu title={this.getSubMenuTitle(item)} key={item.path}>
          {this.getNavMenuItems(item.routes)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  getMenuItemPath = (item) => {
    const { title } = item;
    const { location } = this.props;
    return (
      <Link to={item.path} replace={item.path === location.pathname}>
        <span>{title}</span>
      </Link>
    );
  };

  render() {
    return (
      <Layout className={cls(styles['main-box'])}>
        <Header className={cls('menu-header')}>应用路由列表</Header>
        <Content className={cls('menu-box')}>
          <ScrollBar>
            <Menu key="Menu" mode={'inline'} theme={'light'}>
              {this.getNavMenuItems(routes)}
            </Menu>
          </ScrollBar>
        </Content>
      </Layout>
    );
  }
}
