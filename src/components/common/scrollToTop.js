import { Component } from 'react';
import {
  withRouter,
} from "react-router-dom";

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props.location) !== JSON.stringify(prevProps.location)) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)