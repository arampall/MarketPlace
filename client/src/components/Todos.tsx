import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  CheckboxProps,
  Divider,
  Grid,
  Segment,
  Form,
  FormProps,
  Card,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  CardGroup
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

  handleNameChange = (event: React.FormEvent<HTMLInputElement>, {value}: FormProps) => {
    this.setState({ newItemName: value as string }) 
  }

  handleDescriptionChange = (event: React.FormEvent<HTMLTextAreaElement>, {value}: FormProps) => {
    this.setState({ newItemDescription: value as string }) 
  }

  handleCategoryChange = (event: React.SyntheticEvent<HTMLElement, Event>, {value}: FormProps) => {
    this.setState({ newItemCategory: value as string }) 
  }

  handlePriceChange = (event: React.FormEvent<HTMLInputElement>, {value}: FormProps) => {
    this.setState({ newItemPrice: value as number }) 
  }

  handleConditionChange = (event: React.FormEvent<HTMLInputElement>, {value}: FormProps) => {
    this.setState({ newItemCondition: value as string}) 
  }


  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.FormEvent<HTMLFormElement>, data: FormProps) => {
    try {
      console.log(typeof(this.state.newItemPrice));
      const newListing: Listing = await createItem(this.props.auth.getIdToken(), {
        name: this.state.newItemName,
        description: this.state.newItemDescription,
        category: this.state.newItemCategory,
        price: Number(this.state.newItemPrice),
        condition: this.state.newItemCondition
      })
      this.setState({
        listings: [...this.state.listings, newListing]
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
        isAvailable: !listing.isAvailable,
        category: listing.category
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
        <Segment padded>
          <Header as="h2">Create a New Listing</Header>
          {this.renderCreateTodoInput()}<br/><br/>
        </Segment>
        <Segment>
          <Header as="h2">My Listings</Header>
          {this.renderTodos()}
        </Segment>
      </div>
    )
  }

  renderCreateTodoInput() {
    const options = [
      { key: 'el', text: 'Electronics', value: 'Electronics' },
      { key: 'fu', text: 'Furniture', value: 'Furniture' },
      { key: 'oth', text: 'Other', value: 'other' },
    ]
    const value: string = this.state.newItemCondition
    return (
      <Segment padded='very' inverted>
        <Form inverted onSubmit={this.onTodoCreate}>
          <Form.TextArea label='Item Summary' name='newItemDescription' 
            placeholder='Tell us about the item you want to sell...' required
            onChange={this.handleDescriptionChange}/>
          <Form.Group widths='equal'>
            <Form.Input fluid required name='newItemName'
              label='Item Type' placeholder='Please enter the type of Item (Eg. TV, table) ' 
              onChange={this.handleNameChange}/>
            <Form.Select
              fluid
              label='Category'
              name='newItemCategory'
              options={options}
              placeholder='Select'
              onChange={this.handleCategoryChange}
              required
            />
            <Form.Input fluid label='Price' type='number' name='newItemPrice' 
              placeholder='Price (in USD)' required
              onChange={this.handlePriceChange} />
          </Form.Group>
          <Form.Group inline>
          <label>Item Condition</label>
          <Form.Radio
            label='New'
            value='New'
            checked={value === 'New'}
            name='newItemCondition'
            onChange={this.handleConditionChange}
          />
          <Form.Radio
            label='Used-Good'
            value='Used-Good'
            checked={value === 'Used-Good'}
            name='newItemCondition'
            onChange={this.handleConditionChange}
          />
          <Form.Radio
            label='Used'
            value='Used'
            checked={value === 'Used'}
            name='newItemCondition'
            onChange={this.handleConditionChange}
          />
        </Form.Group>
          <Form.Button>Submit</Form.Button>
        </Form>
      </Segment>
    )
  }

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
      <Grid.Column padded columns="equal">
        <CardGroup itemsPerRow='3'>
          {this.state.listings.map((listing, pos) => {
            return (
              <Card fluid={true} key={listing.itemId}>
                <Image src={listing.attachmentUrl} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>
                    {listing.description} ({listing.name})
                  </Card.Header>
                  <Card.Meta>
                  {listing.category}
                  </Card.Meta>
                  <Card.Description>
                    Condition: {listing.condition}
                  </Card.Description>
                  <Card.Description>
                    Price: {listing.price}$
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Grid.Column verticalAlign='middle'>
                    <Checkbox
                        label='Is Available'
                        onChange={() => this.onTodoCheck(pos)}
                        checked={listing.isAvailable}
                    />
                    <Button.Group floated='right' basic>
                      <Button
                        icon
                        size='mini'
                        onClick={() => this.onEditButtonClick(listing.itemId)}
                      >
                      <Icon inverted color='green' name="pencil" />
                      </Button>
                      <Button
                        icon
                        size='tiny'
                        onClick={() => this.onTodoDelete(listing.itemId)}
                      >
                        <Icon color='red' name="delete" />
                      </Button>
                    </Button.Group>
                  </Grid.Column>                 
                </Card.Content>
              </Card>         
            )
          })}
        </CardGroup>
      </Grid.Column>
    )
  }
}
