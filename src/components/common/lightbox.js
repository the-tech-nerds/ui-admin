import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

export default class LightboxExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photoIndex: this.props.index,
            isOpen: this.props.isOpen,
            images: this.props.images
        };

    }

    render() {
        const { photoIndex, isOpen, images } = this.state;
        return (
            <div>
                {isOpen && <Lightbox
                        mainSrc={images[photoIndex].url}
                        nextSrc={images[(photoIndex + 1) % images.length].url}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length].url}
                        onCloseRequest={() => {
                            this.setState({ isOpen: false });
                            this.props.response();
                        }}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + images.length - 1) % images.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % images.length,
                            })
                        }
                    /> }
            </div>
        );
    }
}
