import React, { Component } from 'react';
import './style.scss';
import {
  Pagination,
} from 'react-bootstrap';
import RefreshIcon from '../../../Images/Icons/loop.svg';
import '../Multilingual/i18nextInit';


const range = (from, to, step = 1) => {
  let i = from;
  const rangeArry = [];

  while (i <= to) {
    rangeArry.push(i);
    i += step;
  }

  return rangeArry;
};

class PaginationAndPageNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rangeReach: 2,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = page => (evt) => {
    evt.preventDefault();

    const {
      currentPageNum,
      updatePageNum,
    } = this.props;
    if (page === 'next') {
      updatePageNum(currentPageNum + 1);
    } else if (page === 'prev') {
      updatePageNum(currentPageNum - 1);
    } else if (page === 'noaction') {
      return false;
    }
    updatePageNum(page);
    return false;
  }

  handleInputChange = (event) => {
    const { target } = event;
    const { updatePageCount } = this.props;
    updatePageCount(target.value);
  }

  render() {
    const {
      totalPageCount,
      totalElementCount,
      currentPageNum,
      recordPerPage,
    } = this.props;
    const {
      rangeReach,
    } = this.state;

    // if (!totalElementCount || totalPageCount === 1) return null;

    let startRange = (currentPageNum <= rangeReach)
      ? 1
      : currentPageNum - rangeReach;
    let endRange = (currentPageNum > (totalPageCount - rangeReach))
      ? totalPageCount
      : currentPageNum + rangeReach;

    if ((endRange - startRange) < (rangeReach * 2) + 1) {
      if (currentPageNum <= rangeReach) {
        // at start so adjust end range
        endRange += (rangeReach - (currentPageNum - startRange));
        if (endRange > totalPageCount) {
          endRange = totalPageCount;
        }
      } else if ((endRange + rangeReach) > totalPageCount) {
        // at end so adjust start range
        startRange -= (rangeReach - (endRange - currentPageNum));
        if (startRange < 1) {
          startRange = 1;
        }
      }
    }
    const pages = range(startRange, endRange);
    // console.log('currentPageNum', currentPageNum);
    // console.log('totalPageCount', totalPageCount);

    // calculate start and end Results Count
    const startResultCount = (currentPageNum - 1) * recordPerPage;
    const endResultCount = Math.min(startResultCount + recordPerPage - 1, totalElementCount - 1);
   

    return (
      <div className="row p-3 text-center pagination-wrapper">
        <div className="col-lg-5 pagination_block">
          {!(!totalElementCount || totalPageCount === 1) && (
            <nav className="pagination__container">
              <Pagination>
                <Pagination.Prev className="prev" disabled={(currentPageNum <= 1)} onClick={this.handleClick((currentPageNum > 1) ? 'prev' : 'noaction')} />
                {pages.map(page => (
                  <Pagination.Item
                    key={page}
                    active={currentPageNum === page}
                    onClick={this.handleClick(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next className="next" disabled={(currentPageNum >= totalPageCount)} onClick={this.handleClick((currentPageNum < totalPageCount) ? 'next' : 'noaction')} />
              </Pagination>
            </nav>
          )}
        </div>
        <div className="col-lg-3 responsive_pageSize">
          <label className="mr-2" htmlFor="perPage">Show</label>
          <select id="perPage" className="customSelect" value={recordPerPage} onChange={this.handleInputChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2">Items</span>
        </div>
        <div className="col-lg-4 pagination_result">
          <div className="numberPage">
            <span>
              {startResultCount + 1}
              -
              {endResultCount + 1}
            </span>
            {' '}
            of
            {' '}
            <span>
              {totalElementCount}
              {' '}
              results
            </span>
          </div>
        </div>
      </div>

    );
  }
}

export default PaginationAndPageNumber;