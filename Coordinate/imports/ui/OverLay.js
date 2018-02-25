import React, {Component} from 'react'

export class OverLay extends Component{
  constructor(props){
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    let type = e.target.className;
    console.log(type);
    this.props.select(false);
    this.props.setCate(type);

  }
  render(){
    return(
    <div style={{position:'absolute', width:'100%', height:'100%'}}>
      <div id="blur"> </div>
      <div id="cMenu">
        <div id="cCardContainer">

          <div id="cCard" >
            <div id = "barrier" className="baseball" onClick={this.handleClick}/>
            <i className="fas fa-baseball-ball"></i>
            <div id="fcCard">Baseball</div>
          </div>

          <div id="cCard">
            <div id = "barrier" className="basketball" onClick={this.handleClick}/>

            <i className="fas fa-basketball-ball"></i>
            <div id="fcCard">Basketball</div>
          </div>

          <div id="cCard">
            <div id = "barrier" className="bowling" onClick={this.handleClick}/>
            <i className="fas fa-bowling-ball"></i>
            <div id="fcCard">Bowling</div>
          </div>

          <div id="cCard">
            <div id = "barrier" className="football" onClick={this.handleClick}/>

            <i className="fas fa-football-ball"></i>
            <div id="fcCard">Football</div>
          </div>

          <div id="cCard">
            <div id = "barrier" className="golf" onClick={this.handleClick}/>

            <i className="fas fa-golf-ball"></i>
            <div id="fcCard">Golf</div>
          </div>

          <div id="cCard">
            <div id = "barrier" className="volleyball" onClick={this.handleClick}/>

            <i className="fas fa-volleyball-ball"></i>
            <div id="fcCard">Volleyball</div>
          </div>


        </div>
      </div>
    </div>);
      }
}
