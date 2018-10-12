import React, { Component } from 'react';
import { any, string, bool, object } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import LayoutConsumer from './consumer';
import { Header, Box, Dialog } from '../components';
import { shallowCompare } from '../../utils';
import { Sidebar } from '../routing';

class Layout extends Component {
  static propTypes = {
    children: any,
    title: string,
    header: object,
    sidebar: object,
    sidebarRight: object,
    hideSidebar: bool,
    hideSidebarRight: bool,
    layout: object,
    appColor: string,
    appName: string,
    baseEntities: object,
    headerProps: object,
    backgroundColor: string,
    layouts: object,
    variant: string,
  }

  state = {
    unableToFindHeader: false,
    unableToFindSidebar: false,
    unableToFindSidebarRight: false,
  }

  componentDidMount() {
    this.setLayoutProperties();
    this.setHeaderProperties();
    this.setSidebarProperties();
    this.setSidebarRightProperties();
  }

  componentDidUpdate( prevProps ) {
    if (
      this.props.appColor !== prevProps.appColor &&
      this.props.appColor != null
    ) {
      this.props.layout.setAppColor( this.props.appColor );
    }

    if (
      this.props.backgroundColor !== prevProps.backgroundColor &&
      this.props.backgroundColor != null
    ) {
      this.props.layout.setBackgroundColor( this.props.backgroundColor );
    }

    if (
      this.props.title !== prevProps.title &&
      this.props.title != null
    ) {
      this.props.layout.setTitle( this.props.title );
    }

    if ( !shallowCompare( this.props.header, prevProps.header )) {
      this.setHeaderProperties();
    }

    if ( !shallowCompare( this.props.sidebar, prevProps.sidebar )) {
      this.setSidebarProperties();
    }

    if ( !shallowCompare( this.props.sidebarRight, prevProps.sidebarRight )) {
      this.setSidebarRightProperties();
    }

    if (
      this.state.unableToFindHeader &&
      this.props.header &&
      this.props.header.variant
    ) {
      const variant = `header/header.${this.props.header.variant}`;

      if ( this.props.layouts.sublayouts[variant] )
        this.setHeaderProperties();
    }

    if (
      this.state.unableToFindSidebar &&
      this.props.sidebar &&
      this.props.sidebar.variant
    ) {
      const variant = `sidebar/sidebar.${this.props.sidebar.variant}`;

      if ( this.props.layouts.sublayouts[variant] )
        this.setSidebarProperties();
    }

    if (
      this.state.unableToFindSidebarRight &&
      this.props.sidebarRight &&
      this.props.sidebarRight.variant
    ) {
      const variant = `sidebar-right/sidebar-right.${this.props.sidebarRight.variant}`;

      if ( this.props.layouts.sublayouts[variant] )
        this.setSidebarRightProperties();
    }
  }

  setLayoutProperties() {
    const { layout, title, appColor, hideSidebar, hideSidebarRight, backgroundColor } = this.props;

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

    layout.setBackgroundColor( backgroundColor || '#FFF' );

    if ( hideSidebar !== layout.hideSidebar ) {
      layout.setSidebarVisibility( hideSidebar );
    }
    else if ( hideSidebar == null ) {
      layout.setSidebarVisibility( false );
    }

    if ( hideSidebarRight !== layout.hideSidebarRight ) {
      layout.setSidebarRightVisibility( hideSidebarRight );
    }
    else if ( hideSidebarRight == null ) {
      layout.setSidebarRightVisibility( false );
    }

    this.setHeaderProperties();
  }

  setHeaderProperties() {
    const { header, layouts } = this.props;

    if ( header && header.variant ) {
      const variant = `header/header.${header.variant}`;
      const headerProps = layouts.sublayouts[variant];

      if ( headerProps ) {
        this.props.layout.setHeaderProps( headerProps );
        this.props.layout.setHeaderVisibility( true );

        if ( this.state.unableToFindHeader )
          this.setState({ unableToFindHeader: false });
      }
      else {
        this.setState({ unableToFindHeader: true });
      }
    }
    else {
      this.props.layout.setHeaderVisibility( false );
    }
  }

  setSidebarProperties() {
    const { sidebar, layouts } = this.props;

    if ( sidebar && sidebar.variant ) {
      const variant = `sidebar/sidebar.${sidebar.variant}`;
      const sidebarProps = layouts.sublayouts[variant];

      if ( sidebarProps ) {
        this.props.layout.setSidebarProps( sidebarProps );
        this.props.layout.setSidebarVisibility( true );

        if ( this.state.unableToFindSidebar )
          this.setState({ unableToFindSidebar: false });
      }
      else {
        this.setState({ unableToFindSidebar: true });
      }
    }
    else {
      this.props.layout.setSidebarVisibility( false );
    }
  }

  setSidebarRightProperties() {
    const { sidebarRight, layouts } = this.props;

    if ( sidebarRight && sidebarRight.variant ) {
      const variant = `sidebar-right/sidebar-right.${sidebarRight.variant}`;
      const sidebarRightProps = layouts.sublayouts[variant];

      if ( sidebarRightProps ) {
        this.props.layout.setSidebarRightProps( sidebarRightProps );
        this.props.layout.setSidebarRightVisibility( true );

        if ( this.state.unableToFindSidebarRight )
          this.setState({ unableToFindSidebarRight: false });
      }
      else {
        this.setState({ unableToFindSidebarRight: true });
      }
    }
    else {
      this.props.layout.setSidebarRightVisibility( false );
    }
  }

  getContentWidth() {
    const { showSidebar, showSidebarRight, sidebarProps, sidebarRightProps } = this.props.layout;

    let sidebarLeftWidth = 0;
    let sidebarRightWidth = 0;

    if (
      showSidebar &&
      sidebarProps &&
      sidebarProps.inline
    ) {
      sidebarLeftWidth = sidebarProps.width || 0;
    }

    if (
      showSidebarRight &&
      sidebarRightProps &&
      sidebarRightProps.inline
    ) {
      sidebarRightWidth = sidebarRightProps.width || 0;
    }

    return `calc(100vw - ${sidebarLeftWidth}px - ${sidebarRightWidth}px`;
  }

  render() {
    const { children, title, layout, appName } = this.props;

    const {
      headerProps,
      showHeader,
      showSidebar,
      sidebarProps,
      sidebarRightProps,
      showSidebarRight,
    } = layout;

    return (
      <Box
        height="100%"
        width="100%"
        flex={1}
      >
        <Helmet>
          <title>
            {(
              !appName ||
              title === appName
            )
              ? title
              : `${title} | ${appName}`}
          </title>

          <style>
            {`
              html,
              body {
                background: ${layout.backgroundColor} !important
              }
            `}
          </style>
        </Helmet>

        {(
          showSidebar &&
          sidebarProps != null &&
          Object.keys( sidebarProps ).length > 0
        ) && (
          <Sidebar
            side="left"
            {...sidebarProps}
          />
        )}

        <Box
          flexDirection="column"
          flex={1}
          {...(
            showSidebar ||
            showSidebarRight
          ) && {
            width: this.getContentWidth(),
          }}
        >
          {(
            showHeader &&
            headerProps != null &&
            Object.keys( headerProps ).length > 0
          ) && (
            <Header {...headerProps} />
          )}

          {children}
        </Box>

        {(
          showSidebarRight &&
          sidebarRightProps != null &&
          Object.keys( sidebarRightProps ).length > 0
        ) && (
          <Sidebar
            side="right"
            {...sidebarRightProps}
          />
        )}

        <Dialog />
      </Box>
    );
  }
}

export { Layout };

const mapStateToProps = state => ({
  appName: state.layout.appName,
  layouts: state.vertx.layouts,
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )(
  props => (
    <LayoutConsumer>
      {layout => (
        <Layout
          {...props}
          layout={layout}
        />
      )}
    </LayoutConsumer>
  )
);
