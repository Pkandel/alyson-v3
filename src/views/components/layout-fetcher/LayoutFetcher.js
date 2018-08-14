import { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { object, func, string } from 'prop-types';
import { removeStartingAndEndingSlashes, NavigationActions } from '../../../utils';
import { store } from '../../../redux';
import { withKeycloak } from '../../components/keycloak';

class LayoutFetcher extends Component {
  static propTypes = {
    layouts: object,
    children: func.isRequired,
    currentUrl: string.isRequired,
    navigationReducer: object,
    keycloak: object,
  }

  state = {
    layout: null,
  }

  componentDidMount() {
    this.getLayout();
  }

  shouldComponentUpdate( nextProps ) {
    if ( !this.state.layout )
      return true;

    if (
      this.props.keycloak.isAuthenticated &&
      nextProps.navigationReducer &&
      nextProps.navigationReducer.index != null &&
      nextProps.navigationReducer.routes
    ) {
      const { index, routes } = nextProps.navigationReducer;
      const strippedCurrentUrl = removeStartingAndEndingSlashes( this.props.currentUrl );
      const strippedLastRoute = removeStartingAndEndingSlashes( routes[index].params.layout );

      return strippedCurrentUrl === strippedLastRoute;
    }

    return true;
  }

  componentDidUpdate( prevProps ) {
    if ( prevProps.currentUrl !== this.props.currentUrl || !this.state.layout ) {
      this.getLayout();
    }
  }

  getLayout() {
    const { pages } = this.props.layouts;
    const { currentUrl, navigationReducer } = this.props;

    const strippedCurrentUrl = removeStartingAndEndingSlashes( currentUrl );

    if ( pages[strippedCurrentUrl] ) {
      this.setState({ layout: pages[strippedCurrentUrl] });
    }
    else {
      const keys = Object.keys( pages ).sort( this.handleSortPages );
      const fragments = strippedCurrentUrl.split( '/' );

      keys.some( key => {
        const params = {};

        const splitKey = key.split( '/' ).map(( split, index ) => {
          if ( split.startsWith( ':' )) {
            params[split.slice( 1 )] = fragments[index];

            return fragments[index];
          }

          return split;
        });

        if ( splitKey.join( '/' ) === strippedCurrentUrl ) {
          if ( Platform.OS === 'web' ) {
            store.dispatch(
              replace({
                pathname: location.pathname,
                state: {
                  ...location.state,
                  ...params,
                },
              })
            );
          }
          else {
            const { key } = navigationReducer.routes[navigationReducer.index];

            store.dispatch(
              NavigationActions.setParams({ key, params })
            );
          }

          this.setState({ layout: pages[key] });

          return true;
        }
      });
    }
  }

  /**
   * Sort the pages so that the routes which contain
   * a colon (`:`) or a splat / asterisk (`*`) always come
   * last in the list.
   *
   * For example, if we had `load/add` and `load/:id` as our
   * 2 routes, we want to see if the current URL would match
   * `load/add` before the second route as the second route
   * is a wildcard, and anything will match it.
   *
   * TODO: expand this check further so it better compares
   * routes containing multiple colons and asterisks
   *
   * NB: return numbers:
   *   0 - keep the same order
   *   1 - Put A after B
   *   -1 - Put B after A
   */
  handleSortPages = ( pageA, pageB ) => {
    if ( pageA.includes( ':' ) && pageB.includes( ':' ))
      return 0;

    /* Put pageA after layoutB. */
    if ( pageA.includes( ':' )) return 1;

    /* Put routeB after layoutA. */
    if ( pageB.includes( ':' )) return -1;

    return 0;
  }

  render() {
    const { layout } = this.state;

    return this.props.children( layout );
  }
}

const mapStateToProps = state => ({
  layouts: state.vertx.layouts,
  navigationReducer: state.navigation,
});

export default connect( mapStateToProps )(
  withKeycloak( LayoutFetcher )
);
