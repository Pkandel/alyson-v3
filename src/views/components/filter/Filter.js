import React, { Component, isValidElement } from 'react';
import { array, arrayOf, string, shape } from 'prop-types';
import dlv from 'dlv';
import { isArray, isString } from '../../../utils';
import { Recursive } from '..';
import { Fragment, Input } from '../index';

class Selection extends Component {
  static defaultProps = {
  }

  static propTypes = {
    children: array,
    filters: arrayOf(
      shape({
        filterProps: string,
        filterPaths: arrayOf({
          string,
        }),
      }),
    ),
  }

  state = {
    value: '',
  }

  handleChangeValue = newValue => {
    console.log( 'value', newValue );
    this.setState({
      value: newValue,
    });
  }

  filterData = ( filterValue ) => {
    const { filters } = this.props;
    const newPropObject = {};
    // "dataProp": {
    //   "items": "_query.items"
    // },
    // "filterPaths": [
    //   "attributes.PRI_NAME.value",
    //   "company.attributes.PRI_NAME.value"
    // ]

    // check is the filters are supplied
    if ( !isArray( filters )) return null;

    // process each filter separately

    filters.forEach( filter => {
      /* get each of the filter prop keys, these are
       *the props that the filtered data will be passed as */

      if ( filter.filterProps ) {
        // get Keys
        const filterPropsKeys = Object.keys( filter.filterProps );

        filterPropsKeys.forEach( filterPropKey => {
          // get Values
          const items = filter.filterProps[filterPropKey];

          // for each Key, loop over each item
          items.find( item => {
            // check if filterPaths exists
            // check if filterValue is a string of length > 0
            if (
              isArray( filter.filterPaths, { ofMinLength: 1 }) &&
              isString( filterValue, { ofMinLength: 1 })
            ) {
              // loop over each filterPath
              const isMatchFound = filter.filterPaths.some( path => {
                // dlv item to filterPath to see if it exists
                const field = dlv( item, path );
                // compare to filterValue (includes)
                const isValueFound = isString( field )
                  ? field.includes( filterValue )
                  : field.toString.includes;

                return isValueFound;
              });

              return isMatchFound;
            }

          // add filtered data for this prop to the new object with the same key
          });

          newPropObject[filterPropKey] = items;
        });
      }

      // return new props object
      return newPropObject;
    });

    return newPropObject;
  }

  render() {
    const { children } = this.props;
    const { value } = this.state;

    const filteredData = this.filterData();

    console.log( filteredData );

    if ( !isArray( children )) {
      if ( isValidElement )
        return children;

      return (
        <Recursive
          {...children}
          context={{
            ...filteredData,
          }}
        />
      );
    }

    return (
      <Fragment>
        <Input
          type="text"
          onChangeValue={this.handleChangeValue}
          value={value}
        />
        {children.map(( child, index ) => (
          <Recursive
            {...child.props}
            key={index} // eslint-disable-line react/no-array-index-key
            context={{
              ...child.props.context,
              ...filteredData,
            }}
          />
        ))}
      </Fragment>
    );
  }
}

export default Selection;
