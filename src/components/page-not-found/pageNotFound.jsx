import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => (
  <div className="page-not-found">
    <h4 className="not-found-text">404 page not found.</h4>
    <div className="back-to-main"><Link to="/" className="link">Back to main</Link></div>
  </div>
);

export default PageNotFound;
