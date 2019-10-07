import React from 'react';
import '../Stylesheets/StyleButton.css';

class StyleButton extends React.Component {
    constructor(props) {
        super(props);
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }
    render() {
        let className = 'editor-styleButton';
        if (this.props.active) {
            className += ' editor-activeStyleButton';
        }
        return (
            <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
        );
    }
}

export default StyleButton;
