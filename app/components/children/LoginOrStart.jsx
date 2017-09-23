import React from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';


class LoginOrStart extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    var that = this; 
    axios.get('/api/loggedin').then((logincheck) =>{
      console.log('/api/loggedin returns')
      that.props.updateLogin(logincheck)
      axios.get('/api/user').then((foundUser) => {
        console.log('/api/user returns')
        console.log('foundUser received', foundUser)
        if(foundUser.data !== null) {
          that.props.updateUser(foundUser.data)
        }
        that.render();
      })
    })
  }

  render(props) {
    if (this.props.userLogged === false && this.props.serverResponded === true) {
      var content = (
        <div className="container card text-center login">
          <div className="card-block">
              <h1 className="card-title">Welcome to Circle-Mesh</h1>
              <br />
              <h4 className="card-text">Log in with Linkedin and start accomplishing your dreams today.</h4>
              <br/>
              <a href={`auth/linkedin/create/${this.props.tempUser.tempID}`} className="btn btn-primary">Login(create mesh)</a>
          </div>
        </div>
      )
    } else if (this.props.userLogged === true && this.props.serverResponded === true){
      var content = (
        <div className="container card text-center login">
          <div className="card-block">
              <h1 className="card-title">Welcome to Circle-Mesh</h1>
              <br />
              <h4 className="card-text">Create or see your current goal</h4>
              <br/>

              <Link to="/form" className="btn btn-success create_btn">Create a Mesh</Link>
              <Link to="/mesh" className="btn btn-info">Join a Mesh</Link>

          </div>
        </div>
      )
    } else {
      var content = (<h3>Waiting for server ...</h3>)
    }
  	return (
      <div>
        {content}
      </div>
  	)
  }
}

export default LoginOrStart;