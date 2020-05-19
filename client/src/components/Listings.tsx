import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Grid,
  Segment,
  Card,
  Header,
  Icon,
  Image,
  Loader,
  CardGroup
} from 'semantic-ui-react'

import { getAllItems} from '../api/todos-api'
import Auth from '../auth/Auth'
import { Listing } from '../types/Listing'

interface ListingsProps {
  auth: Auth
  history: History
}

interface ListingsState {
  listings: Listing[]
  loadingTodos: boolean
}

export class Listings extends React.PureComponent<ListingsProps, ListingsState> {
  state: ListingsState = {
    listings: [],
    loadingTodos: true
  }

  async componentDidMount() {
    try {
      const listings = await getAllItems('all');
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
        <Header as="h2">All Items for Sale</Header>
          {this.renderAllListings()}
      </div>
    )
  }

  

  renderAllListings() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderSaleItems()
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

  renderSaleItems() {
    return (
      <Grid.Column padded columns="equal">
        <CardGroup itemsPerRow='3'>
          {this.state.listings.map((listing, pos) => {
            return (
              <Card key={listing.itemId}>
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
              </Card>         
            )
          })}
        </CardGroup>
      </Grid.Column>
    )
  }
}
