import '@uppy/dashboard/dist/style.css';

import React, { Component } from 'react';
import { bool, number, func, object, array, string, oneOf, oneOfType } from 'prop-types';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import Webcam from '@uppy/webcam';
import Dashboard from '@uppy/dashboard';
import './inputFile.css';
import { Box, Recursive } from '../../../components';
import InputFileItem from './file-item';
import InputFileTouchable from './file-touchable';
import config from '../../../../config';
import { isArray } from '../../../../utils';

class InputFile extends Component {
  static defaultProps = {
    maxNumberOfFiles: 0,
    autoProceed: true,
    defaultValue: [],
    imageOnly: false,
    multiple: false,
  }

  static propTypes = {
    maxNumberOfFiles: number,
    autoProceed: bool,
    onChange: func,
    defaultValue: object,
    value: array,
    imageOnly: bool,
    multiple: bool,
    renderItem: object,
    renderInput: object,
    margin: number,
    marginX: number,
    marginY: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
    padding: number,
    paddingX: number,
    paddingY: number,
    paddingTop: number,
    paddingRight: number,
    paddingBottom: number,
    paddingLeft: number,
    textAlign: oneOf(
      ['left', 'center','right']
    ),
    height: oneOfType(
      [string, number]
    ),
    width: oneOfType(
      [string, number]
    ),
    backgroundColor: string,
    borderWidth: number,
    borderTopWidth: number,
    borderRightWidth: number,
    borderBottomWidth: number,
    borderLeftWidth: number,
    borderColor: string,
    borderRadius: number,
    borderBottomLeftRadius: number,
    borderBottomRightRadius: number,
    borderTopLeftRadius: number,
    borderTopRightRadius: number,
    wrapperProps: object,
    color: string,
    onChangeValue: func,
  }

  state = {
    error: null,
    files: [],
  }

  componentDidMount() {
    let files = [];

    try {
      files = ( this.props.value && this.props.value !== 'null' )
        ? JSON.parse( this.props.value )
        : this.props.defaultValue;
    } catch ( e ) {
      //
    }

    this.setState({
      files,
    });

    const { autoProceed } = this.props;

    this.uppy = new Uppy({
      autoProceed,
      debug: false,
      restrictions: {
        maxNumberOfFiles: this.props.maxNumberOfFiles,
        // allowedFileTypes: this.props.allowedFileTypes,
      },
      onBeforeFileAdded: ( currentFile ) => this.checkFileType( currentFile ),
    })
      .use( Dashboard, {
        closeModalOnClickOutside: true,
        note: this.props.imageOnly
          ? '.jpeg, .jpg, and .png file types allowed only'
          : 'any file type allowed',
        hideProgressAfterFinish: true,
      })
      .use( AwsS3, { serverUrl: config.uppy.url })
      .use( Webcam, { target: Dashboard })
      .run();

    this.uppy.on( 'complete', this.handleComplete );
  }

  componentWillUnmount() {
    if ( this.uppy )
      this.uppy.close();
  }

  get modalName() {
    return 'uppy';
  }

  checkFileType = ( currentFile ) => {
    const imageTypes = ['image/jpeg', 'image/png'];

    if (
      !this.props.imageOnly ||
      (
        this.props.imageOnly &&
        imageTypes.includes( currentFile.type )
      )
    ) {
      this.uppy.info( 'Upload successful', 'success', 3000 );

      return true;
    }

    this.uppy.info( 'Invalid file type', 'error', 3000 );

    return false;
  }

  handleComplete = result => {
    this.setState( state => ({
      files: [
        ...state.files,
        ...result.successful.map( file => ({
          ...file,
          uploaded: true,
          id: file.meta.key,
        })),
      ],
    }), this.handleSaveToServer );
  }

  handleSaveToServer = () => {
    const { files } = this.state;

    this.setState({ error: null });

    setTimeout( this.close, 2000 );

    if ( this.props.onChange ) {
      this.props.onChange({ target: { value: files } });
    }
  }

  handleError = error => {
    this.setState({ error });
  }

  handleOpenModal = () => {
    this.uppy.getPlugin( 'Dashboard' ).openModal();
  }

  handleRemoveFile = fileId => () => {
    this.setState( state => ({ files: state.files.filter(({ id }) => id !== fileId ) }), () => {
      this.handleRefreshUppy();
      this.handleSaveToServer();
    });
  }

  handleRefreshUppy = () => {
    this.uppy.setState({
      files: this.state.files,
    });
  }

  close = () => {
    this.uppy.getPlugin( 'Dashboard' ).closeModal();
  }

  isValidFile = file => {
    if ( !file.type ) {
      return false;
    }

    if ( !file.id ) {
      return false;
    }

    if ( !file.uploadURL ) {
      return false;
    }

    if ( !file.name ) {
      return false;
    }

    if ( !file.uploaded ) {
      return false;
    }

    if ( !file.size ) {
      return false;
    }

    return true;
  }

  render() {
    const {
      imageOnly,
      multiple,
      renderItem,
      renderInput,
      ...restProps
    } = this.props;

    const { files, error } = this.state;
    const validFiles = files && files.length ? files.filter( file => this.isValidFile( file )) : [];

    return (
      <Box
        width="100%"
        flexDirection="column"
      >
        {isArray( validFiles, { ofMinLength: 1 }) && (
          validFiles.map( file => {
            if ( renderItem ) {
              const context = {
                file,
                onRemove: this.handleRemoveFile,
                error,
              };

              return (
                <Recursive
                  {...renderItem}
                  key={file.id}
                  context={context}
                />
              );
            }

            return (
              <InputFileItem
                key={file.id}
                id={file.id}
                size={file.size}
                name={file.name}
                uploaded={file.uploaded}
                type={file.type}
                preview={file.preview}
                uploadURL={file.uploadURL}
                error={error}
                onRemove={this.handleRemoveFile}
              />
            );
          })
        )}

        {(
          isArray( validFiles, { ofExactLength: 0 }) ||
          multiple
        ) && (
          renderInput ? (
            <Recursive
              {...renderInput}
              context={{
                numberOfUploadedFiles: validFiles.length,
                onOpenModal: this.handleOpenModal,
              }}
            />
          ) : (
            <InputFileTouchable
              {...restProps}
              onPress={this.handleOpenModal}
              text={(
              `Click to Upload a${isArray( validFiles, { ofMinLength: 1 }) ? 'nother' : imageOnly ? 'n' : ''} ${imageOnly ? 'image' : 'file'} `
              )}
            />
          )
        )}
      </Box>
    );
  }
}

export default InputFile;
