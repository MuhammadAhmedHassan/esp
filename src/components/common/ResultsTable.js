import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { isArray } from 'util';
import Pagination from './Pagination';

export default class ResultsTable extends Component {
  onPageChanged = (data) => {
    const { updatePaginationParams } = this.props;
    updatePaginationParams(data);
  }

  render() {
    const {
      totalResults = 0,
      pagination = false,
      paginationParam = [],
      tableData = {
        labels: [],
        results: [],
      },
      selectedAction,
    } = this.props;
    
    const { pageNumber, pageSize } = paginationParam;
    const resultCount = tableData.results.length;

    const toResult = (pageNumber * pageSize) > resultCount
      ? resultCount
      : (pageNumber * pageSize);
      
    const fromResult = ((pageNumber * pageSize) - pageSize) + 1;

    return (
      <div>
        {pagination && (
          <div className="row">
            <div className="col">
              {fromResult > 0 && (
                <p>
                  {`Displaying ${fromResult} - ${toResult} of ${totalResults} Results`}
                </p>
              )}
            </div>
            <div className="col">
              <Pagination
                totalRecords={totalResults}
                pageLimit={pageSize}
                pageNumber={pageNumber}
                pageNeighbours={2}
                onPageChanged={this.onPageChanged}
              />
            </div>
          </div>
        )}
        <div className="container">
          <div className="row">
            <table className="table">
              <thead>
                <tr className="title">
                  {
                    tableData.labels.map(col => (
                      <th
                        className="table__cell table__cellHeader"
                        scope="col"
                        key={col}
                      >
                        {col}
                      </th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  resultCount > 0
                    ? tableData.results.map(result => (
                      <tr
                        className="table__row table__row--selectable"
                        key={result.key}
                      >
                        {
                          Object.keys(result.colData).map((key, index) => {
                            if (index === 0) {
                              return <th className="table__cell" key={key}>{result.colData[key]}</th>;
                            }
                            if ((key === 'actions') && (isArray(result.colData[key]))) {
                              return (
                                <td className="table__cell table__cell--actions" key={key}>

                                  <Dropdown
                                    alignRight
                                    className="dropdown--actions"
                                    onSelect={selectedAction && ((eventKey, event) => selectedAction(eventKey, event))}
                                  >
                                    <Dropdown.Toggle variant="outline">
                                      Select
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      {
                                        result.colData[key].map(part => (
                                          part && (
                                            <Dropdown.Item
                                              href={!selectedAction && part[0]}
                                              eventKey={part[0]}
                                              key={`${result.key}-${part[1]}`}
                                              className={part[1]}
                                            >
                                              {part[2]}
                                            </Dropdown.Item>
                                          )
                                        ))
                                      }
                                    </Dropdown.Menu>
                                  </Dropdown>

                                </td>
                              );
                            }
                            return <td className="table__cell" key={key}>{result.colData[key]}</td>;
                          })
                        }
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan={tableData.labels.length} className="text-center">Sorry No Record Found</td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Pagination
              totalRecords={totalResults}
              pageLimit={pageSize}
              pageNumber={pageNumber}
              pageNeighbours={2}
              onPageChanged={this.onPageChanged}
            />
          </div>
        </div>
      </div>
    );
  }
}
