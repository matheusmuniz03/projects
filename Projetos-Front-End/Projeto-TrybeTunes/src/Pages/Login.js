import React from 'react';
import { Redirect } from 'react-router';
import Loading from './Loading';
import { createUser } from '../services/userAPI';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      loginButton: true,
      loading: false,
      redirect: false,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.validarButton = this.validarButton.bind(this);
  }

  async handleSubmit(name) {
    this.setState({
      loading: true,
    });

    await createUser({ name });
    this.setState({
      redirect: true,
    });
  }

  onInputChange({ target }) {
    const { value } = target;

    this.setState({
      name: value,
    });
    this.alterarButton();
  }

  alterarButton = () => {
    const validar = this.validarButton();
    this.setState({
      loginButton: !validar,
    });
  }

  validarButton() {
    const { name } = this.state;
    const minimo = 2;
    return name.length >= minimo;
  }

  render() {
    const { name, loginButton, loading, redirect } = this.state;

    if (loading) {
      return (
        <div>
          <Loading />
          { redirect && <Redirect to="/search" /> }
        </div>
      );
    }

    return (
      <div data-testid="page-login">
        <form>
          <label htmlFor="inputLogin">
            Nome:
            <input
              data-testid="login-name-input"
              type="text"
              name="inputLogin"
              onChange={ this.onInputChange }
            />
          </label>
          <button
            type="submit"
            name="loginSubmit"
            data-testid="login-submit-button"
            disabled={ loginButton }
            onClick={ () => this.handleSubmit(name) }
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
