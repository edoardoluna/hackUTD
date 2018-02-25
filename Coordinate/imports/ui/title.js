import React, {Component} from 'react'

export class Title extends Component{
  constructor(props){
    super(props);
    //this.state = {start: 'none'};
    this.onClickC = this.onClickC.bind(this);
    this.onClickS = this.onClickS.bind(this);
  }
  onClickC(){
    if (this.props.start == 'none' || this.props.start == 'search'){
      this.props.change('create');
    }
    else{
      this.props.change('none');
    }
  }
  onClickS(){
    if (this.props.start == 'none' || this.props.start == 'create'){
      this.props.change('search');
    }
    else{
      this.props.change('none');
    }
  }

  render(){
    return(
      <div id="titleBar">
        <button id="button" className="oLeft" onClick={this.onClickS}>FIND</button>
        <h1 id="header">COORDINATE</h1>
        <button id="button" className="oLeft" onClick={this.onClickC}>CREATE</button>

      </div>
    );}
  }
