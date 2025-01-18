import React, { Component } from 'react';

class SimpleFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' },
        // { id: 4, name: 'Alice' },
        // { id: 5, name: 'Mary' },
      ]
    };
  }

  handleFilterChange = (event) => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    const filteredData = this.state.data.filter((item) =>
      item.name.toLowerCase().includes(this.state.filterText.toLowerCase())
    );

    return (
      <div>
        <input type="text" onChange={this.handleFilterChange} />
        <ul>
          {filteredData.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SimpleFilter;