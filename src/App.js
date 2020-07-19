import React from "react";
import WeatherDetails from "./WeatherDetails.js";
import loadScript from "./helper.js";
import ErrorBoundary from "./ErrorHandler.js";
import "./App.css";
const API_KEY = "AIzaSyCfkDTOXSxtJlwSrkeM9SX41-BjQ3ZsMCc";

class App extends React.Component {
  constructor(props) {
    super();
    this.autocompleteInputRef = React.createRef();
    this.autoCompleteObj = null;
    this.state = {
      //State has been initialized to empty, if required current geolocation can be read and populated by default but its not required here so not added.
      lat: "",
      long: "",
    };
  }

  componentDidMount() {
    try {
      this.initializeMap();
    } catch (err) {
      console.error(
        "Error occurred in componentDidMount method of App Component " + err
      );
    }
  }

  initializeMap = () => {
    try {
      let promise = loadScript(
        "https://maps.googleapis.com/maps/api/js?key=" +
          API_KEY +
          "&libraries=places"
      );
      //After lodaing the script file,  promise will be resolved and google api class will be instantiated.
      promise.then(
        (script) => {
          const google = window.google;
          const context = this;
          function initialize() {
            context.autoCompleteObj = new google.maps.places.Autocomplete(
              context.autocompleteInputRef.current
            );
            google.maps.event.addListener(
              context.autoCompleteObj,
              "place_changed",
              ((that) => () => context.handleInputChange(that))(context)
            );
          }
          google.maps.event.addDomListener(window, "load", initialize);
        },
        (error) => alert(`Error occurred while loading: ${error.message}`)
      );
    } catch (err) {
      console.error(
        "Error occurred in initializeMap method of App Component " + err
      );
    }
  };

  componentWillUnmount() {
    try {
      //Removing listener on unload
      this.autoCompleteObj.removeListener(
        "place_changed",
        this.handleInputChange
      );
    } catch (err) {
      console.error(
        "Error occurred in componentWillUnmount method of App Component " + err
      );
    }
  }

  handleInputChange = () => {
    try {
      console.info(
        "handleInputChange " + this.autocompleteInputRef.current.value
      );
      const locationObj = this.autoCompleteObj.getPlace().geometry.location;
      //Whenever input value changes , we fetch the current longitude and latitude which is then used by Weather component to get weather info by api
      this.setState({
        lat: locationObj.lat(),
        long: locationObj.lng(),
      });
    } catch (err) {
      console.error(
        "Error occurred in handleInputChange method of App Component " + err
      );
    }
  };
  handleBlur = (event) => {
    console.log("handleBlur" + this.autocompleteInputRef.current.value);
    //On Blur, state is made empty so that component is re rendered and Weather detail is made empty based on empty input
    if (this.autocompleteInputRef.current.value === "") {
      this.setState({
        lat: "",
        long: "",
      });
      console.log(this.state.lat);
    }
  };

  render() {
    return (
      <React.Fragment>
        <ErrorBoundary>
          <input
            ref={this.autocompleteInputRef}
            id="autocomplete"
            placeholder="Enter your address"
            type="text"
            onBlur={this.handleBlur}
          ></input>
        </ErrorBoundary>
        <WeatherDetails locationParams={this.state}></WeatherDetails>
      </React.Fragment>
    );
  }
}
export default App;
