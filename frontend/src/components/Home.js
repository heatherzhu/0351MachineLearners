import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

import emptyImage from './empty_image.png';
import exampleImage from './example_line_plot.png';
import abstractImage from './example_abstract_plot.png';
import facebookLogo from './facebook_logo.png';
import instagramLogo from './instagram_logo.png';
import twitterLogo from './twitter_logo.png';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import { BrowserRouter as Link } from "react-router-dom";
import { VictoryChart, VictoryTheme, VictoryLine, VictoryLegend } from "victory";
import Rendering from './Rendering';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showCSVDownloadModal : false,
      show2DImageDownloadModal : false,
      show3DImageDownloadModal : false,
      showShareModal : false,
      typingTimer : null,
      input_string : "",
      diagramData : {sentiments: [], movingAverage: []},
      tokens : []
    };

    this.textUpdate = this.textUpdate.bind(this);
    this.clearText = this.clearText.bind(this);
    this.open2DImageDownloadModal = this.open2DImageDownloadModal.bind(this);
    this.close2DImageDownloadModal = this.close2DImageDownloadModal.bind(this);
    this.open3DImageDownloadModal = this.open3DImageDownloadModal.bind(this);
    this.close3DImageDownloadModal = this.close3DImageDownloadModal.bind(this);
    this.openCSVDownloadModal = this.openCSVDownloadModal.bind(this);
    this.closeCSVDownloadModal = this.closeCSVDownloadModal.bind(this);
    this.openShareModal = this.openShareModal.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.getImage = this.getImage.bind(this);
    this.callServer = this.callServer.bind(this);
  }

  textUpdate(event) {
    clearTimeout(this.state.typingTimer);
    if (event.target.value) {
      this.setState({input_string: event.target.value, typingTimer: setTimeout(this.callServer, 1000)});
    }
  }

  callServer() {
    //this.setState({diagramData: [{x: 1, y: Math.floor(Math.random() * 10)}, {x: 2, y: Math.floor(Math.random() * 10)}, {x: 3, y: Math.floor(Math.random() * 10)}]});
    console.log("Sent to server: " + this.state.input_string);
    fetch("http://localhost:5000/api/emotions", {
      method: "POST",
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({"text": this.state.input_string})})
    .then(response => {
      response.json().then(res => {
        console.log(res);
        console.log(res.x_values);
        this.setState({diagramData: {sentiments: res.x_values.sentiments, movingAverage: res.x_values.movingAverage}})
        this.setState({tokens: res.tokens})
        //console.log(this.state.tokens)
      })
    })
    .catch(error => console.log("error: " + error));
    //this.refs.abstractImage.src = abstractImage;

  }

  getImage() {
    //return this.state.diagramImage;
  }



  open2DImageDownloadModal() {
    this.setState({
      show2DImageDownloadModal : true
    });
  }

  close2DImageDownloadModal() {
    this.setState({
      show2DImageDownloadModal : false
    });
  }

  open3DImageDownloadModal() {
    this.setState({
      show3DImageDownloadModal : true
    });
  }

  close3DImageDownloadModal() {
    this.setState({
      show3DImageDownloadModal : false
    });
  }

  openCSVDownloadModal() {
    this.setState({
      showCSVDownloadModal : true
    });
  }

  closeCSVDownloadModal() {
    this.setState({
      showCSVDownloadModal : false
    });
  }

  openShareModal() {
    this.setState({
      showShareModal : true
    });
  }

  closeShareModal() {
    this.setState({
      showShareModal : false
    });
  }

  clearText() {
    this.setState({diagramData: {sentiments: [], movingAverage: []}, input_string: ""});
    //this.refs.abstractImage.src = emptyImage;
    this.refs.mainTextArea.value = "";
  }

  render() {
    return (
      <div className="main-page">
        <div className="row justify-content-center ml-0 mr-0">
          <div className="pt-3 col-lg-10">
            <div className="row py-3 ml-0 mr-0">
              <div className="col-6 px-1 py-5">
                <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={10} onChange={event => this.textUpdate(event)} placeholder="enter text here" ref="mainTextArea" />
                  </Form.Group>
                </Form>
                <Button className="mx-2" id="green" variant="primary" onClick={this.clearText}>clear</Button>
                <Button className="mx-2" id="green" variant="primary">undo</Button>
                <p id="subtitle">when you enter your writing, it gets analyzed by our algorithm in order to draw an image!</p>
              </div>
              <div className="col-6 px-3">
                <Tabs defaultActiveKey="linear" id="figure-tabs" transition={false}>
                  <Tab eventKey="linear" title="linear">
                    <VictoryChart theme={VictoryTheme.material}>
                      <VictoryLegend orientation = {"horizontal"} x={100} y={20} data = {[
                        {name: "Sentiment", symbol: {fill:"black"}},
                        {name: "Running Average", symbol: {fill:"red"}}]}/>
                      <VictoryLine data={this.state.diagramData.sentiments}/>
                      <VictoryLine style={{ data: { stroke: "red" } }} data={this.state.diagramData.movingAverage}/>
                    </VictoryChart>
                    {/*2D buttons and modal*/}
                    <Button className="mx-2" id="green" variant="primary" onClick={this.openCSVDownloadModal}>download CSV</Button>
                    <Button className="mx-2" id="pink" variant="primary" onClick={this.openShareModal}>share!</Button>
                    <Button className="mx-2" id="green" variant="primary" onClick={this.open2DImageDownloadModal}>download image</Button>
                    <Modal show={this.state.show2DImageDownloadModal} onHide={this.close2DImageDownloadModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Download Image?</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>Are you sure you want to download the image?</Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={this.close2DImageDownloadModal}>
                          Cancel
                        </Button>
                        <a href={exampleImage} download="Sentiment-2D.png">
                          <Button variant="primary" onClick={this.close2DImageDownloadModal}>
                            Download
                          </Button>
                        </a>
                      </Modal.Footer>
                    </Modal>
                  </Tab>
                  <Tab eventKey="abstract" title="abstract">
                    <div className = "col-60" id="ThreeDContainer">
                      <Rendering array={this.state.tokens}/>
                    </div>
                    {/*3D buttons and modal*/}
                    <Button className="mx-2" id="green" variant="primary" onClick={this.openCSVDownloadModal}>download CSV</Button>
                    <Button className="mx-2" id="pink" variant="primary" onClick={this.openShareModal}>share!</Button>
                    <Button className="mx-2" id="green" variant="primary" onClick={this.open3DImageDownloadModal}>download image</Button>
                    <Modal show={this.state.show3DImageDownloadModal} onHide={this.close3DImageDownloadModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Download Image?</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>Are you sure you want to download the image?</Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={this.close3DImageDownloadModal}>
                          Cancel
                        </Button>
                        <a href={abstractImage} download="Sentiment-3D.png">
                          <Button variant="primary" onClick={this.close3DImageDownloadModal}>
                            Download
                          </Button>
                        </a>
                      </Modal.Footer>
                    </Modal>
                  </Tab>
                </Tabs>

              </div>
            </div>
          </div>
        </div>

        {/* Download Modal to download a CSV file */}
        <Modal show={this.state.showCSVDownloadModal} onHide={this.closeCSVDownloadModal}>
          <Modal.Header closeButton>
            <Modal.Title>Download CSV?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to download the CSV?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeCSVDownloadModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.downloadImageFile}>
                Download
              </Button>
          </Modal.Footer>
        </Modal>

        {/* Download Modal to download a 2D image
        <Modal show={this.state.showImageDownloadModal} onHide={this.closeImageDownloadModal}>
          <Modal.Header closeButton>
            <Modal.Title>Download Image?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to download the image?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeImageDownloadModal}>
              Cancel
            </Button>
            <a href={exampleImage} download="Sentiment-2D.png">
              <Button variant="primary" onClick={this.closeImageDownloadModal}>
                Download
              </Button>
            </a>
          </Modal.Footer>
        </Modal>*/}

        <Modal show={this.state.showShareModal} centered dialogClassName="share-modal" onHide={this.closeShareModal}>
          <Modal.Header closeButton className="no-border"/>
          <Modal.Body>
            <div className="col">
              <Modal.Title className="col no-gutter">
                <p className="h4 text-center">looks great!</p>
                <h3 className="h1 text-center">wanna share?</h3>
              </Modal.Title>
              <div className='row justify-content-center'>
                <div className="col text-center">
                  <a href="https://www.facebook.com/" target="_blank">
                    <Image width="60%" src={facebookLogo} />
                  </a>
                </div>
                <div className="col text-center">
                  <a href="https://www.instagram.com/" target="_blank">
                    <Image width="60%" src={instagramLogo} />
                  </a>
                </div>
                <div className="col text-center">
                  <a href="https://www.twitter.com/" target="_blank">
                    <Image width="60%" src={twitterLogo} />
                  </a>
                </div>
              </div>
            </div>
          </Modal.Body>

        </Modal>

      </div>
    );
  }
}

export default Home;
