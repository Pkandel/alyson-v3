import React, { Component, Fragment } from 'react';
import { any, string, bool, object } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import LayoutConsumer from './consumer';
import { Header, Sidebar } from '../routing';

class Layout extends Component {
  static propTypes = {
    children: any,
    title: string,
    hideHeader: bool,
    hideSidebar: bool,
    layout: object,
    appColor: string,
    appName: string,
  }

  componentDidMount() {
    this.checkForLayoutChanges();
  }

  checkForLayoutChanges() {
    const { layout, title, appColor, hideSidebar, hideHeader } = this.props;

    if (
      typeof title === 'string' &&
      title.length > 0
    ) {
      layout.setTitle( title );
    }

    if (
      typeof appColor === 'string' &&
      appColor.length > 0
    ) {
      layout.setAppColor( appColor );
    }

    if ( hideSidebar !== layout.hideSidebar ) {
      layout.setSidebarVisibility( hideSidebar );
    }
    else if ( hideSidebar == null ) {
      layout.setSidebarVisibility( false );
    }

    if ( hideHeader !== layout.hideHeader ) {
      layout.setHeaderVisibility( hideHeader );
    }
    else if ( hideHeader == null ) {
      layout.setHeaderVisibility( false );
    }
  }

  render() {
    const { children, title, hideHeader, hideSidebar, appName } = this.props;

    return (
      <Fragment>
        <Helmet>
          <title>
            {(
              !appName ||
              title === appName
            )
              ? title
              : `${title} | ${appName}`}
          </title>
        </Helmet>

        {!hideHeader && (
        <Header />
        )}

        {!hideSidebar && (
        <Sidebar />
        )}

        {children}
      </Fragment>
    );
  }
}

export { Layout };

const mapStateToProps = state => ({
  appName: state.layout.appName,
});

export default connect( mapStateToProps )(
  props => (
    <LayoutConsumer>
      {layout => (
        <Layout {...props} layout={layout} />
      )}
    </LayoutConsumer>
  )
);
