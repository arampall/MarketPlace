import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, MenuItemProps } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditTodo } from './components/EditTodo'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Todos'
import { Listings } from './components/Listings'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  activeItem: string
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
    this.state={
      activeItem : 'home'
    };
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  handleMenuItemClick = (event: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
    if(data.name){
      this.setState({activeItem: data.name})
    }
  }

  render() {
    return (
      <div>
        <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
      </div>
    )
  }

  generateMenu() {
    const { activeItem } = this.state;
    return (
      <Grid.Column>
        <Menu pointing secondary size='huge'>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={this.handleMenuItemClick}
          />
          <Menu.Item
            name='my listings'
            active={activeItem === 'my listings'}
            onClick={this.handleMenuItemClick}
          />
          <Menu.Menu position='right'>
            {this.logInLogOutButton()}
          </Menu.Menu>
        </Menu><br/><br/>
      </Grid.Column>
    )
  }

  /*generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }*/

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  putDummyContent(){
    return(
      <Segment>
        <img src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
      </Segment>
    )
  }

  generateCurrentPage() {
    if(this.state.activeItem === 'home'){
      return (
        <Switch>
          <Route
            path="/"
            exact
            render={props => {
              return <Listings {...props} auth={this.props.auth} />
            }}
          />
        </Switch>
      )
    }
    else if (this.state.activeItem === 'my listings'){
      if (!this.props.auth.isAuthenticated()) {
        return <LogIn auth={this.props.auth} />
      }
  
      return (
        <Switch>
          <Route
            path="/"
            exact
            render={props => {
              return <Todos {...props} auth={this.props.auth} />
            }}
          />
  
          <Route
            path="/todos/:todoId/edit"
            exact
            render={props => {
              return <EditTodo {...props} auth={this.props.auth} />
            }}
          />
  
          <Route component={NotFound} />
        </Switch>
      )
    }

  }
}
