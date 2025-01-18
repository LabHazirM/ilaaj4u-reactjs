import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";

import { GoogleApiWrapper, InfoWindow, Map, Marker } from "google-maps-react";
import { connect } from "react-redux";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const LoadingContainer = () => <div>Loading...</div>;

class GoogleMaps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  onMarkerClick() {
    alert("You clicked in this marker");
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Lab Address Marker</CardTitle>
                <p className="card-title-desc">
                  Showing the address of the lab on google maps.
                </p>
                <div
                  id="gmaps-markers"
                  className="gmaps"
                  style={{ position: "relative" }}
                >
                  <Map
                    google={this.props.google}
                    style={{ width: "100%", height: "100%" }}
                    zoom={14}
                    initialCenter={{
                      lat: 40.854885,
                      lng: -88.081807,
                    }}
                  >
                    <Marker onClick={this.onMarkerClick} />
                    <InfoWindow>
                      <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                      </div>
                    </InfoWindow>
                  </Map>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Overlays</CardTitle>
                <p className="card-title-desc">Example of google maps.</p>
                <div
                  id="gmaps-overlay"
                  className="gmaps"
                  style={{ position: "relative" }}
                >
                  <Map
                    google={this.props.google}
                    zoom={14}
                    style={{ width: "100%", height: "100%" }}
                    initialCenter={{
                      lat: 40.854885,
                      lng: -88.081807,
                    }}
                  >
                    <Marker onClick={this.onMarkerClick} />
                    <InfoWindow>
                      <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                      </div>
                    </InfoWindow>
                  </Map>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

GoogleMaps.propTypes = {
  google: PropTypes.object,
};

export default connect(
  null,
  {}
)(
  GoogleApiWrapper({
    apiKey: "AIzaSyCxkLuAV4blCJQ4Qf80ScTocGHW8x-CyaA",
    LoadingContainer: LoadingContainer,
    v: "3",
  })(GoogleMaps)
);
