import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import MusicCard from './MusicCard';
import getMusics from '../services/musicsAPI';
import { getFavoriteSongs } from '../services/favoriteSongsAPI';

export default class Album extends Component {
  constructor() {
    super();

    this.state = {
      musics: [],
      favorites: [],
    };
  }

  componentDidMount() {
    this.addSongs();
  }

  addSongs = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const musicas = await getMusics(id);
    const favoritos = await getFavoriteSongs();
    this.setState({
      musics: [...musicas],
      favorites: [...favoritos],
    });
  };

  songs = () => {
    const { musics } = this.state;
    return (
      <div>
        {musics.map((music, index) => {
          const { previewUrl, trackName, trackId } = music;
          const { favorites } = this.state;
          const check = favorites.some((track) => track.trackId === trackId);
          return index ? (
            <MusicCard
              key={ trackId }
              previewUrl={ previewUrl }
              trackName={ trackName }
              trackId={ trackId }
              music={ music }
              isChecked={ check }
            />
          ) : (
            <div key="something">
              <h3 data-testid="artist-name">{musics[index].artistName}</h3>
              <h4 data-testid="album-name">{musics[index].collectionName}</h4>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { state, songs } = this;
    const { musics } = state;
    return (
      <div data-testid="page-album">
        <Header />
        {musics.length ? songs() : undefined}
      </div>
    );
  }
}

Album.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
