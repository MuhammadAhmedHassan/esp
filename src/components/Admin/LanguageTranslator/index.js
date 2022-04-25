import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Button, Col, Row, Table, Modal, Form, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import './style.scss';
import DownloadIcon from '../../../Images/Icons/downloads.svg';
import EditIcon from '../../../Images/Icons/Edit.svg';
import UploadIcon from '../../../Images/Icons/upload.svg';
import RemoveIcon from '../../../Images/Icons/remove.svg';
import CheckedIcon from '../../../Images/Icons/checked.svg';
import PaginationAndPageNumber from '../../shared/Pagination';
import { userService } from '../../../services';
import Api from '../../common/Api';

export class LanguageTranslator extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      userId,
      ModelsAdd: false,
      ModelUpdate: false,
      pageIndex: 1,
      totalRecords: 0,
      pageSize: 10,
      loaded: false,
      isActive: false,
      value: '',
      languageList: [],
      published: false,
      languageCulture: '',
      updateId: 0,
      id: 0,
      File: '',
      responseStatus: false,
      selectedFile: null,
      successMessage: '',
      updateSuccessMessage: '',
      uploadSuccessMessage: '',
      displayMessage: false,
      upLoader: false,
      downLoder: false,
    };
  }

  componentDidMount() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getAllLanguageListing();
    }
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getAllLanguageListing();
    }
  }

  displayText = () => {
    const { upLoader, downLoder } = this.state;
    if (upLoader === true) {
      return (<h4>Uploading...</h4>);
    } if (downLoder === true) {
      return (<h4>Downloading...</h4>);
    }
  }

  handleAlertClose = () => {
    window.setTimeout(() => {
      this.setState({
        displayMessage: false,
      });
    }, 2000);
  }

  getAllLanguageListing = () => {
    const { token, pageIndex, pageSize } = this.state;
    const data = {
      languageId: 1,
      pageIndex,
      pageSize,
      showUnPublished: true,
    };

    fetch(`${Api.getAllLanguage} `, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            languageList: response.data,
            loaded: true,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllLanguageListing());
          });
        } else {
          this.setState({
            languageList: [],
            loaded: true,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  handleClose = () => {
    this.setState({
      ModelsAdd: false,
      ModelUpdate: false,
    });
  };

  handleAddLanguage = () => {
    const { ModelsAdd } = this.state;
    this.setState({
      ModelsAdd: !ModelsAdd,
    });
  };

  handleUpdateLanguage = (id, name, published, languageCulture) => {
    const { ModelUpdate } = this.state;
    this.setState({
      ModelUpdate: !ModelUpdate,
      updateId: id,
      value: name,
      published,
      languageCulture,


    });
  };

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loaded: false,
      });
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loaded: false,
    });
  }
  
  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  handleSubmit = () => {
    const {
      token, published, value, userId, languageCulture,
    } = this.state;
    const data = {
      languageId: 1,
      name: value,
      id: userId,
      languageCulture,
      uniqueSeoCode: 'tt',
      published,
    };

    fetch(`${Api.addLanguage}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),

    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            displayMessage: true,
            successMessage: response.message,
            responseStatus: response.statusCode,
          },
          this.getAllLanguageListing(),
          this.handleClose(),
          this.handleAlertClose());
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleSubmit());
          });
        } else {
          this.setState({
            successMessage: response.message,
            responseStatus: response.statusCode,
            displayMessage: true,
          }, () => {
            this.handleAlertClose();
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  updateLanguage = () => {
    const {
      token, published, value, updateId, languageCulture,
    } = this.state;
    const data = {
      languageId: 1,
      name: value,
      id: updateId,
      languageCulture,
      uniqueSeoCode: 'tt',
      published,
    };

    fetch(`${Api.updateLanguage}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            successMessage: response.message,
            responseStatus: response.statusCode,
            displayMessage: true,
          },
          this.getAllLanguageListing(),
          this.handleClose(),
          this.handleAlertClose());
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.updateLanguage());
          });
        } else {
          this.setState({
            successMessage: response.message,
            responseStatus: response.statusCode,
            displayMessage: true,

          }, () => {
            this.handleAlertClose();
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }


  handleFileChange = (e, id) => {
    this.setState({
      updateId: id,
      [e.target.name]: e.target.files[0],
    }, () => this.getUploadFile());
  }

  getUploadFile = () => {
    this.setState({
      upLoader: true,
    });
    const { token, updateId } = this.state;
    const data = {
      languageId: 1,
      requestedlanguageid: updateId,
    };

    const uploadData = new FormData();
    for (const name in this.state) {
      uploadData.append(name, this.state[name]);
    }

    Object.keys(data).forEach((key) => {
      uploadData.append(key, data[key]);
    });
    fetch(`${Api.getImportResourceString}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
      }),
      body: uploadData,
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            successMessage: response.message,
            responseStatus: response.statusCode,
            displayMessage: true,
            File: [],
            upLoader: false,
          }, () => {
            this.handleAlertClose();
          });
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getUploadFile());
          });
        } else {
          this.setState({
            successMessage: response.message,
            responseStatus: response.statusCode,
            displayMessage: true,
            File: [],
            upLoader: false,
          }, () => {
            this.handleAlertClose();
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }


  getDownloadfile = (id) => {
    this.setState({ downLoder: true });
    const { token } = this.state;
    fetch(`${Api.getLanguageResourceString}?id=${id}&languageId=${1}`, {
      method: 'GET',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.blob())
      .then((blob) => {
        this.setState({ loading: false });
        if (blob.type === undefined || blob.type === 'application/json') {
          alert('Please try again getting some error.');
        } else {
          // 2. Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'ResourceStrings.xlsx'); // 3. Append to html page
          document.body.appendChild(link); // 4. Force download
          link.click(); // 5. Clean up and remove the link
          link.parentNode.removeChild(link);
          this.setState({ downLoder: false });
        }
      })
      .catch(err => console.error(err.toString()));
  }


  handleInputChange(event) {
    const { target } = event;
    const {
      name, type, checked, languageCulture,
    } = target;
    const value = type === 'checkbox' ? checked : target.value;
    this.setState({
      [name]: value,
      [languageCulture]: value,
    });
  }

  render() {
    const {
      totalRecords, pageIndex, pageSize, ModelsAdd,
      ModelUpdate, loaded, value, successMessage, responseStatus,
      languageList, published, languageCulture, displayMessage,
    } = this.state;
    let counter = 1;
    const { t } = this.props;
    return (
      <>
        {
          <div className="row">
            <div className="col-md-12 ">
              {this.displayText()}
            </div>
          </div>
        }
        {
          displayMessage && (
            <div className="row">
              <div className="col-md-12">
                <div className={`alert alert-${responseStatus === 200 ? 'success' : 'danger'}`} role="alert">
                  {successMessage}
                </div>
              </div>
            </div>
          )
        }
        <div className="container-fluid languageTranslator">
          <div className="card_layout">

            <Row className="justify-content-end">
              <Col md={4} className="d-flex justify-content-end">
                <Button
                  className="btn btn-primary px-5"
                  onClick={() => this.handleAddLanguage()}
                >
                  {t('LanguagePage.AddLangBtn')}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                {
                  loaded ? (
                    <>
                      <Table responsive striped bordered className="mt-3">
                        <thead className="table-header">
                          <tr>
                            <th>{t('SrNo')}</th>
                            <th>{t('LanguagePage.TableHeader_LanguageName')}</th>
                            <th>{t('LanguagePage.TableHeader_LanguageCulture')}</th>
                            <th>{t('PublishedText')}</th>
                            <th>{t('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {languageList.map(list => (
                            <tr key={list.id}>
                              <td>{counter++}</td>
                              <td>{list.name}</td>
                              <td>{list.languageCulture}</td>
                              <td className="publishedIcon">
                                {list.published ? (
                                  <span className="languageTranslator languageTranslator-editIcon">
                                    <img
                                      src={CheckedIcon}
                                      alt="Checked Icon"
                                    />
                                  </span>
                                ) : (
                                  <span className="languageTranslator languageTranslator-download">
                                    <img
                                      src={RemoveIcon}
                                      alt="Remove Icon"
                                    />
                                  </span>
                                )}
                                {list.published}
                              </td>
                              <td className="">
                                <div className="languageTranslator">
                                  {!(list.id === 1)
                                    && (
                                      <>
                                        <span className="languageTranslator_action languageTranslator_action--editIcon">
                                         
                                          <OverlayTrigger
                                            placement="top"
                                            delay={{ show: 50, hide: 40 }}
                                            overlay={this.renderTooltip('Edit')}
                                          >
                                            <img
                                              src={EditIcon}
                                              alt="Edit Icon"
                                              disabled={list.id}
                                              onClick={() => this.handleUpdateLanguage(list.id, list.name, list.published, list.languageCulture)
                                            }
                                            />
                                          </OverlayTrigger>
                                        </span>

                                        <span className="languageTranslator_action languageTranslator_action--download">
                                         
                                          <OverlayTrigger
                                            placement="top"
                                            delay={{ show: 50, hide: 40 }}
                                            overlay={this.renderTooltip('Download')}
                                          >
                                            <img
                                              src={DownloadIcon}
                                              alt="DownloadIcon"
                                              onClick={() => this.getDownloadfile(list.id)
                                            }
                                            />
                                          </OverlayTrigger>
                                        </span>
                                        <div className="imageUpload">
                                          <label htmlFor="file-input">
                                           
                                            <OverlayTrigger
                                              placement="top"
                                              delay={{ show: 50, hide: 40 }}
                                              overlay={this.renderTooltip('Upload')}
                                            >
                                              <img
                                                className="imageUpload_icon"
                                                src={UploadIcon}
                                                alt="Upload Icon"
                                                disabled={list.id}
                                              />
                                            </OverlayTrigger>
                                          </label>
                                          <input
                                            className="imageUpload_inputFile"
                                            id="file-input"
                                            type="file"
                                            name="File"
                                            onChange={e => this.handleFileChange(e, list.id)}
                                          />
                                        </div>
                                      </>
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </>
                  )
                    : <p>{t('LoadingText')}</p>
                }
                {ModelsAdd && (
                  <Modal
                    show={this.handleAddLanguage}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    className="addModel"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title className="addPopup-title">{t('LanguagePage.AddLangBtn')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form onSubmit={this.handleSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                          <Form.Label column sm="5">{t('LanguagePage.Pop-upScreen.SelectName')}</Form.Label>
                          <Col sm="5">
                            <Form.Control type="select" name="value" onChange={event => this.handleInputChange(event)} />
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                          <Form.Label column sm="5">{t('LanguagePage.Pop-upScreen.LangCulture')}</Form.Label>
                          <Col sm="5">
                            <Form.Control type="text" name="languageCulture" placeholder="" onChange={event => this.handleInputChange(event)} />
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                          <Form.Label column sm="5">{t('LanguagePage.Pop-upScreen.Publish')}</Form.Label>
                          <Col sm="2">
                            <Form.Control checked={published} type="checkbox" name="published" onChange={event => this.handleInputChange(event)} />
                          </Col>
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                        {t('SaveBtn')}
                      </Button>
                      <Button variant="light" onClick={this.handleClose}>
                        {t('CancelBtn')}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )}

                {ModelUpdate && (
                  <Modal
                    show={this.handleUpdateLanguage}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{t('LanguagePage.Pop-upScreen.UpdateTitle')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                          <Form.Label column sm="5">{t('LanguagePage.Pop-upScreen.SelectName')}</Form.Label>
                          <Col sm="5">
                            <Form.Control as="input" value={value} name="value" onChange={event => this.handleInputChange(event)} />
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                          <Form.Label column sm="5">{t('LanguagePage.Pop-upScreen.LangCulture')}</Form.Label>
                          <Col sm="5">
                            <Form.Control as="input" value={languageCulture} name="languageCulture" placeholder="" onChange={event => this.handleInputChange(event)} />
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                          <Form.Label column sm="5">{t('LanguagePage.Pop-upScreen.Publish')}</Form.Label>
                          <Col sm="2">
                            <Form.Control checked={published} type="checkbox" name="published" onChange={event => this.handleInputChange(event)} />
                          </Col>
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" type="submit" onClick={this.updateLanguage}>
                        {t('UserRollPage.UpdatePop-up.Title')}
                      </Button>
                      <Button variant="light" onClick={this.handleClose}>
                        {t('CancelBtn')}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )}
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="mt-3">
                  <PaginationAndPageNumber
                    totalPageCount={Math.ceil(totalRecords / pageSize)}
                    totalElementCount={totalRecords}
                    updatePageNum={this.updatePageNum}
                    updatePageCount={this.updatePageCount}
                    currentPageNum={pageIndex}
                    recordPerPage={pageSize}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(LanguageTranslator);
