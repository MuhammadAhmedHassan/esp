import React from 'react';
import { Breadcrumb, Image } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { Link, withRouter } from 'react-router-dom';
import SideMenu from '../Sidebar/sideMenu';
import burger from '../../../Images/Icons/icon_burgerMenu.svg';

import './style.scss';

const {
  MenusLinks,
} = SideMenu;

class AdminBreadcrumbContent extends React.Component {
  constructor(props) {
    super(props);
    const { t, i18n } = this.props;
    this.state = {
      menuLinks: MenusLinks(t),
      selectedLang: i18n.language,
    };
  }

  componentDidMount = () => {
    this.updateSidebar();
  }


  componentDidUpdate = () => {
    const { i18n } = this.props;
    const { selectedLang, accessList } = this.state;
    if (i18n.language !== selectedLang) {
      this.updateSidebar();
    }
    const accessListSession = JSON.parse(sessionStorage.getItem('userAccess'));
    if (JSON.stringify(accessList) !== JSON.stringify(accessListSession)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        accessList: accessListSession,
      });
    }
  }


  updateSidebar = () => {
    const { t, i18n } = this.props;
    this.setState({
      menuLinks: MenusLinks(t),
      selectedLang: i18n.language,
    });
  }

  getBreadCrumb = (pathName, item) => {
    if (item.link === pathName) {
      return (
        <li className="breadcrumb-item">
          <span>{item.breadCrumb}</span>
        </li>
      );
    } if (item.dropdowns && item.dropdowns.length > 0) {
      return item.dropdowns.map(x => this.getBreadCrumb(pathName, x));
    }
    return '';
  };

  render() {
    const {
      setSidebarEnabled, isSidebarEnabled, breadcrumbData, location,
    } = this.props;
    const { menuLinks } = this.state;
    return (
      <Breadcrumb>
        <Image className="sidebar-toggle" onClick={() => setSidebarEnabled(!isSidebarEnabled)} src={burger} fluid />
        {
          menuLinks.map(item => (
            this.getBreadCrumb(location.pathname, item)
          ))
        }

      </Breadcrumb>
    );
  }
}

const AdminBreadcrumb = withRouter(AdminBreadcrumbContent);
export default (withTranslation()(AdminBreadcrumb));
