import Anchor from '@trendmicro/react-anchor';
import Dropdown from '@trendmicro/react-dropdown';
import Navbar from '@trendmicro/react-navbar';
import { Nav, NavDropdown, NavItem, MenuItem } from '@trendmicro/react-navs';
import PropTypes from 'prop-types';
import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import styles from './index.styl';

const PageContent = () => (
    <div
        style={{
            border: '1px solid #ddd',
            backgroundColor: '#f5f5f5',
            height: 600,
            marginTop: 15
        }}
    >
        <div className="container-fluid">
            <h3>Page Content</h3>
        </div>
    </div>
);

const StickyNavbar = ({ state, actions }) => {
    console.log(state);
    return (
        <StickyContainer>
            <Sticky>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Nav
                        navStyle="navbar"
                        activeKey={state.tab}
                        onSelect={actions.selectTab}
                    >
                        <NavItem className="text-center" style={{ minWidth: 65 }}>
                            <i className="fa fa-star" style={{ color: '#fff' }} />
                        </NavItem>
                        <NavItem eventKey="business">
                            My Business
                        </NavItem>
                        <NavItem eventKey="employees">
                            My Employees
                        </NavItem>
                        <NavDropdown
                            autoOpen
                            pullRight
                            eventKey="administration"
                            title="Settings"
                            style={{ position: 'fixed', right: 0 }}
                        >
                           
                            <MenuItem eventKey="administration.1">Menu Item 1</MenuItem>
                            <MenuItem eventKey="administration.2">Menu Item 2</MenuItem>
                            <MenuItem eventKey="administration.3">Menu Item 3</MenuItem>
                            <MenuItem eventKey="administration.4">
                                Menu item 4
                                <MenuItem eventKey="administration.4.1">
                                    Second level item one
                                </MenuItem>
                                <MenuItem eventKey="administration.4.2">
                                    Second level item two
                                </MenuItem>
                            </MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
{/*}
                <Button
                            className={classNames(styles.navbarBtn, styles.navbarRight)}
                            btnStyle="flat"
                            onClick={() => {
                                window.location = url;
                            }}
                        >
                            <i className="fa fa-github" />
                            GitHub
                        </Button>{*/}

            </Sticky>
            {/* }
            <PageContent />
            {*/}
        </StickyContainer>
    );
};

StickyNavbar.propTypes = {
    state: PropTypes.object,
    actions: PropTypes.object
};

export default StickyNavbar;