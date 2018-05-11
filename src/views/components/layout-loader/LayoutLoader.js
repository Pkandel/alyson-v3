import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import { shape, object, any } from 'prop-types';
import Layout from '../../layout';
import DataQuery from '../../../utils/data-query';
import Recursive from './Recursive';

class LayoutLoader extends PureComponent {
  static propTypes = {
    layout: shape({
      layout: object,
      children: any,
      context: any,
    }),
    data: object,
  }

  render() {
    const { layout, data } = this.props;

    console.log({ layout }); // eslint-disable-line no-console

    if ( !layout )
      return <Text>No layout specified</Text>;

    /* Calculate the data for the layout */
    const context = { query: new DataQuery( data ).query( layout.query || [] ) };

    return (
      <Layout {...layout.layout} context={context}>
        {layout.children && (
          layout.children instanceof Array
          ? layout.children.map( child => <Recursive {...child} context={context} /> ) // eslint-disable-line react/jsx-key
          : layout.children
        )}
      </Layout>
    );
  }
}

export default LayoutLoader;
