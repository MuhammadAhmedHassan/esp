import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Nav, Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { connect } from 'react-redux';
import SideMenu from './sideMenu';
import './style.scss';

const {
  MenusLinks,
} = SideMenu;

const mapStateToProps = state => ({
  loggedUserRole: state.checkUserRole.user.role,
});

function AccordionTitle({ children, eventKey, className }) {
  const OnClick = useAccordionToggle(eventKey, () => { });

  return (
    <Button
      variant="link"
      type="button"
      className={`accordion__toggle ${className}`}
      onClick={OnClick}
    >
      {children}
    </Button>
  );
}

class SideBarContent extends React.Component {
  constructor(props) {
    super(props);
    const accessList = JSON.parse(sessionStorage.getItem('userAccess'));
    const { i18n } = this.props;
    this.state = {
      selectedLang: i18n.language,
      menuLinks: [],
      accessList,
      selectedClass: '',
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

  matchItemOnURL = (list, match) => {
    const { setBreadcrumbData } = this.props;
    const me = list.map((props) => {
      if (`${match}` === props.url) {
        setBreadcrumbData({ title: props.key, link: props.url });
      }
      if (`${match}` === props.url && props.keyBreadcrumb !== undefined) {
        setBreadcrumbData({ title: props.keyBreadcrumb, link: props.url });
      }

      if (props.nodes) {
        this.matchItemOnURL(props.nodes, match);
      }
      return props;
    });
    return me;
  }

  navigate = (path, key) => {
    const { history, setBreadcrumbData } = this.props;
    history.push(path);
    setBreadcrumbData({ title: key, link: path });
  };

  resetClass = (e) => {
    // this.setState({ selectedClass: e });
  }

  navItem = (menu, aclMenu) => {
    const { location } = this.props;
    const menuItem = aclMenu.filter(x => (x.module === menu.access.module && x.screen === menu.access.permission));
    if (menuItem.length > 0) {
      return (
        <Nav.Link as={Link} to={`${menu.link}`} className={`${menu.link === location.pathname && 'active'}`} eventKey={menu.link} key={menu.name}>
          {menu.name}
        </Nav.Link>
      );
    }
    return '';
  }

  getDropdownMarkup = (dropdown, aclMenu) => {
    const { setBreadcrumbData, location } = this.props;
    const menuItem = aclMenu.filter(x => (x.module === dropdown.access.module && x.screen === dropdown.access.permission));
    const active = dropdown.dropdowns && dropdown.dropdowns.filter(x => `${x.link}` === location.pathname);
    if (menuItem.length > 0) {
      if (dropdown.link) {
        return (
          <Nav.Link as={Link} to={`${dropdown.link}`} className={`${dropdown.link}` === location.pathname && 'active'} eventKey={dropdown.link} key={dropdown.name}>
            {dropdown.name}
          </Nav.Link>
        );
      }
      if (dropdown.dropdowns && dropdown.dropdowns.length > 0) {
        return (
          <Accordion onSelect={e => this.resetClass(e)}>
            <AccordionTitle className={`${active.length !== 0 && 'active'} sub-${dropdown.name}`} eventKey={`sub-${dropdown.name}`}>
              {dropdown.name}
            </AccordionTitle>
            <Accordion.Collapse eventKey={`sub-${dropdown.name}`} className={`${active.length !== 0 && 'show'}`}>
              <>
                {dropdown.dropdowns.map((d) => {
                  const menuInnerItem = aclMenu.filter(x => (x.module === d.access.module && x.screen === d.access.permission));
                  if (menuInnerItem.length > 0) {
                    return (
                      <>
                        <Nav.Link as={Link} to={`${d.link}`} className={`${d.link}` === location.pathname && 'active'} eventKey={d.link} key={d.name}>
                          {d.name}
                        </Nav.Link>
                      </>
                    );
                  } return '';
                })}
              </>
            </Accordion.Collapse>
          </Accordion>
        );
      }
      return (
        <Nav.Link key={dropdown.name} eventKey={dropdown.name}>
          {dropdown.name}
        </Nav.Link>
      );
    }
    return '';
  }

  render() {
    const { location, setBreadcrumbData } = this.props;
    const { menuLinks, accessList, selectedClass } = this.state;

    return (
      <aside className="float-left" id="sidebar-wrapper">
        <Nav className="flex-column">
          {
            (menuLinks && accessList) && (
              <Accordion className="sidebar__content" onSelect={e => this.resetClass(e)}>
                {menuLinks.map((menu, index) => {
                  const active = menu.dropdowns.filter((x) => {
                    if (`${x.link}` === location.pathname) {
                      return x;
                    }
                    if (x.dropdowns && x.dropdowns.length > 0) {
                      return x.dropdowns.some(y => `${y.link}` === location.pathname);
                    }
                    return '';
                  });
                  let aclmenu = [];
                  if (menu.access) {
                    aclmenu = accessList.filter(x => x.module === menu.access.module);
                  }

                  return (
                    aclmenu.length > 0 && (
                      <div className={`menu ${active.length !== 0 && 'active'}`}>
                        {menu.dropdowns.length > 0 ? (
                          <>
                            <AccordionTitle className={selectedClass === `mainMenu-${index}` ? 'active' : 0} eventKey={`mainMenu-${index}`}>
                              {menu.name}
                              <span className="menu__menuIcon" />
                            </AccordionTitle>
                            <Accordion.Collapse eventKey={`mainMenu-${index}`}>
                              <Nav className="flex-column">
                                {
                                  menu.dropdowns && (
                                    menu.dropdowns.map(dropdown => this.getDropdownMarkup(dropdown, accessList))
                                  )
                                }
                              </Nav>
                            </Accordion.Collapse>
                          </>
                        ) : (
                          this.navItem(menu, accessList)
                        )}
                      </div>
                    )
                  );
                })}

                <Nav.Link as={Link} to="/logout">
                  Logout
                </Nav.Link>
              </Accordion>
            )
          }
        </Nav>
      </aside>
    );
  }
}
const SideBar = withRouter(SideBarContent);
export default connect(
  mapStateToProps, null,
)(withTranslation()(SideBar));
