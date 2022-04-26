import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import { addSong, removeSong } from '../services/favoriteSongsAPI';

export default class MusicCard extends Component {
  constructor(props) {
    super(props);
    const { isChecked } = this.props;
    this.state = {
      loaded: false,
      check: isChecked,
    };
  }

          handleCheck = async ({ target }) => {
            const { checked } = target;
            const { music } = this.props;

            this.setState({
              loaded: true,
              check: checked,
            });

            if (checked) {
              await addSong(music);
            } else {
              await removeSong(music);
            }

            this.setState({
              loaded: false,
            });
          }

          render() {
            const { props, state, handleCheck } = this;
            const { trackName, previewUrl, trackId } = props;
            const { loaded, check } = state;
            return (
              <div>
                <p>{trackName}</p>
                <audio data-testid="audio-component" src={ previewUrl } controls>
                  <track kind="captions" />
                  { `O seu navegador não suporta o elemento ${<code>audio</code>}.` }
                </audio>
                <label htmlFor="favorita">
                  Favorita
                  <input
                    type="checkbox"
                    checked={ check }
                    onChange={ handleCheck }
                    data-testid={ `checkbox-music-${trackId}` }
                  />
                </label>
                { loaded && <Loading /> }
              </div>
            );
          }
}

MusicCard.propTypes = {
  previewUrl: PropTypes.string.isRequired,
  trackName: PropTypes.string.isRequired,
  trackId: PropTypes.number.isRequired,
  music: PropTypes.objectOf(PropTypes.any).isRequired,
  isChecked: PropTypes.bool.isRequired,
};
