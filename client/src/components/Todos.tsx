import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createItem, deleteItem, getItems, patchItem } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Listing } from '../types/Listing'

interface ListingsProps {
  auth: Auth
  history: History
}

interface ListingsState {
  listings: Listing[]
  newItemName: string
  newItemDescription: string
  newItemCategory: string
  newItemPrice: number
  newItemCondition: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<ListingsProps, ListingsState> {
  state: ListingsState = {
    listings: [],
    newItemName: '',
    newItemDescription: '',
    newItemCategory: '',
    newItemPrice: 0,
    newItemCondition: '',
    loadingTodos: true
  }

  /*handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }*/

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newListing = await createItem(this.props.auth.getIdToken(), {
        name: this.state.newItemName,
        description: this.state.newItemDescription,
        category: this.state.newItemCategory,
        price: this.state.newItemPrice,
        condition: this.state.newItemCondition
      })
      this.setState({
        listings: [...this.state.listings, newListing],
        newItemName: '',
        newItemDescription: '',
        newItemCategory: '',
        newItemPrice: 0,
        newItemCondition: ''
      })
    } catch {
      alert('New Listing creation failed')
    }
  }

  onTodoDelete = async (itemId: string) => {
    try {
      await deleteItem(this.props.auth.getIdToken(), itemId)
      this.setState({
        listings: this.state.listings.filter(listing => listing.itemId != itemId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const listing = this.state.listings[pos]
      await patchItem(this.props.auth.getIdToken(), listing.itemId, {
        description: listing.description,
        price: listing.price,
        condition: listing.condition,
        isAvailable: !listing.isAvailable
      })
      this.setState({
        listings: update(this.state.listings, {
          [pos]: { isAvailable: { $set: !listing.isAvailable } }
        })
      })
    } catch {
      alert('Item update failed')
    }
  }

  async componentDidMount() {
    try {
      const listings = await getItems(this.props.auth.getIdToken())
      this.setState({
        listings,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch your previous listings: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">My Listings</Header>

        {this.renderTodos()}
      </div>
    )
  }

  /*renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }*/

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading all the listings
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.listings.map((listing, pos) => {
          return (
            <Grid.Row key={listing.itemId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={listing.isAvailable}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {listing.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {listing.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(listing.itemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(listing.itemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {listing.attachmentUrl && (
                <Image src={listing.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
