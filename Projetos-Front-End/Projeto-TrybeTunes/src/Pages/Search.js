import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import searchAlbumsAPI from '../services/searchAlbumsAPI';
import Loading from './Loading';

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      buttonDesativado: true,
      artistaProcurado: '',
      listaAlbuns: [],
      loading: false,
      loaded: false,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.renderAlbums = this.renderAlbums.bind(this);
  }

  onButtonClicked = () => {
    this.setState(
      (before) => ({
        loaded: false,
        loading: false,
        artistaProcurado: before.inputValue,
        inputValue: '',
      }),
      async () => {
        const { artistaProcurado } = this.state;
        const response = await searchAlbumsAPI(artistaProcurado);
        this.setState({
          listaAlbuns: response.length ? [...response] : 'Nenhum álbum foi encontrado',
          loading: false,
          loaded: true,
        });
      },
    );
  }

  onInputChange({ target }) {
    const { value } = target;

    this.setState(
      {
        inputValue: value,
      },
      this.ativarButton,
    );
  }

  ativarButton = () => {
    const { inputValue } = this.state;
    const minCaracters = 2;

    if (inputValue.length >= minCaracters) {
      this.setState({
        buttonDesativado: false,
      });
    }
  }

  renderAlbums(list) {
    return list.map((album) => (
      <div key={ album.collectionId }>
        <h4>{album.artistName}</h4>
        <img
          src={ album.artworkUrl100 }
          alt={ `Álbum ${album.collectionName}` }
        />
        <p>{ album.collectionName }</p>
        <Link
          to={ `/album/${album.collectionId}` }
          data-testid={ `link-to-album-${album.collectionId}` }
        >
          Ir para Album
        </Link>
      </div>));
  }

  render() {
    const { onInputChange, onButtonClicked, renderAlbums, state } = this;
    const {
      buttonDesativado,
      inputValue,
      loading,
      loaded,
      listaAlbuns,
      artistaProcurado,
    } = state;

    return (
      <div data-testid="page-search">
        <Header />

        {loading ? (
          <Loading />
        ) : (
          <form>
            <input
              type="text"
              value={ inputValue }
              data-testid="search-artist-input"
              onChange={ onInputChange }
            />
            <button
              type="button"
              data-testid="search-artist-button"
              disabled={ buttonDesativado }
              onClick={ onButtonClicked }
            >
              Pesquisar
            </button>
          </form>
        )}
        { loaded && (
          <div>
            <span>{`Resultado de álbuns de: ${artistaProcurado}`}</span>
            {(typeof (listaAlbuns) !== 'string')
              ? renderAlbums(listaAlbuns) : listaAlbuns}
          </div>
        )}
      </div>
    );
  }
}
