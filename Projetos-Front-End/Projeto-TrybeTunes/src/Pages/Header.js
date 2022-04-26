import React from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import { getUser } from '../services/userAPI';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nomeLogin: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.onLoading();
  }

    onLoading = async () => {
      const response = await getUser();
      this.setState(
        {
          nomeLogin: response,
        },
        () => this.setState({
          loading: false,
        }),
      );
    }

    render() {
      const { nomeLogin, loading } = this.state;
      return (
        <header data-testid="header-component">
          { loading ? <Loading />
            : <p data-testid="header-user-name">{ nomeLogin.name }</p> }
          <nav>
            <ul>
              <li><Link to="/search" data-testid="link-to-search">Search</Link></li>
              <li><Link to="/favorites" data-testid="link-to-favorites">Fav</Link></li>
              <li><Link to="/profile" data-testid="link-to-profile">Profile</Link></li>
            </ul>
          </nav>
        </header>
      );
    }
}
