import React, { Component } from 'react'
import Pagination from './Pagination'

export default class ResultsTable extends Component {

    constructor(props){
        super(props)
        this.state = { 
			currentPage: 1,
			resultsPerPage: 50
        }
    }

    updateCurrentPage(newPage){
        this.setState({
            currentPage: newPage
        })
    }

    updateResultsPerPage(pageCount){
        this.setState({
            currentPage: 1,
            resultsPerPage: pageCount
        })
    }

    render(){
        const indexOfLastResult = this.state.currentPage * this.state.resultsPerPage;
		const indexOfFirstResult = indexOfLastResult - this.state.resultsPerPage;
        const currentResults = this.props.results.slice(indexOfFirstResult, indexOfLastResult);
        
        var updateCurrentPage = this.updateCurrentPage.bind(this)
        var updateResultsPerPage = this.updateResultsPerPage.bind(this)
        
        var toResult = (this.state.currentPage * this.state.resultsPerPage) > this.props.results.length ? this.props.results.length : (this.state.currentPage * this.state.resultsPerPage)
        var fromResult = ((this.state.currentPage * this.state.resultsPerPage) - this.state.resultsPerPage) + 1
        var totalResults = this.props.results.length
        //TODO: Programatically build the table headings using the data keys or an array of labels passed down.
        return(
            <div>
                <Pagination currentPage={this.state.currentPage}
                            resultsPerPage={this.state.resultsPerPage}
                            results={this.props.results}
                            updateCurrentPage={updateCurrentPage.bind(this)}
                            updateResultsPerPage={updateResultsPerPage.bind(this)}
                             />
                <div>
                    Displaying {fromResult} - {toResult} of {totalResults} Results
                </div>
                <table className="table">
					<thead>
						<tr className='title'>
                            <th className="table__cell table__cellHeader" scope="col">User ID2</th>
							<th className="table__cell table__cellHeader" scope="col">Name</th>
							<th className="table__cell table__cellHeader" scope="col">Email</th>
							<th className="table__cell table__cellHeader" scope="col">Customer Number</th>
							<th className="table__cell table__cellHeader" scope="col">Last Updated</th>
							<th className="table__cell table__cellHeader" scope="col">Origin</th>
						</tr>
					</thead>
					<tbody>
                        {currentResults.map((result,i) =>
                            //TODO: Programatically build the table results from the data passed
                            <tr className="table__row table__row--selectable" 
                                key={i}
                                id={result.id}
                                onClick={this.props.resultAction}
                                >
                                <th className="table__cell" scope="row">{result.userUid}</th>
                                <td className="table__cell">{result.title} {result.firstName} {result.lastName}</td>
                                <td className="table__cell">{result.email}</td>
                                <td className="table__cell">{result.userUid}</td>
                                <td className="table__cell">{result.lastUpdated}</td>
                                <td className="table__cell">{result.origin}</td>
                            </tr>
                        )}
					</tbody>
				</table>
            </div>
        )
    }

}