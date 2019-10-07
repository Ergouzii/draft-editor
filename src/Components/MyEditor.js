import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import StyleButton from './StyleButton.js';
import '../Stylesheets/MyEditor.css';

// References:
// draft.js official docs: https://draftjs.org/docs
// Learn DraftJS: https://learn-draftjs.now.sh

class MyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty()}; // init empty EditorState
        this.onChange = (editorState) => this.setState({editorState});
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.focus = () => this.refs.editor.focus();
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }

    // handle key commands via the handleKeyCommand prop, and hook these into RichUtils
    // to apply or remove the desired style.
    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }

    render() {
        return (
            <div>
                <div className={'editor-container'}>
                    <div className={'editor-controls'}>
                        <InlineStyleControls
                            editorState={this.state.editorState}
                            onToggle={this.toggleInlineStyle}
                        />
                        <BlockStyleControls
                            editorState={this.state.editorState}
                            onToggle={this.toggleBlockType}
                        />
                    </div>
                    <div onClick={this.focus}>
                        <Editor
                            onChange={this.onChange}
                            handleKeyCommand={this.handleKeyCommand}
                            placeholder={'Write something:'}
                            editorState={this.state.editorState}
                            onTab={this.onTab}
                            ref={'editor'}
                            spellCheck={true}
                            blockStyleFn={getBlockStyle}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function getBlockStyle(block) {
    if (block.getType() === 'blockquote') {
        return 'editor-blockquote'; // give blockquote a custom style
    } else {
        return null;
    }
}

const INLINE_STYLES = [
    {
        label: 'Bold',
        style: 'BOLD'
    }, {
        label: 'Italic',
        style: 'ITALIC'
    }, {
        label: 'Underline',
        style: 'UNDERLINE'
    }
];

const InlineStyleControls = (props) => {
    let currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="editor-inlineStyleControls">
            {INLINE_STYLES.map(
                type => <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

const BLOCK_TYPES = [
    {
        label: 'H1',
        style: 'header-one'
    }, {
        label: 'H2',
        style: 'header-two'
    }, {
        label: 'H3',
        style: 'header-three'
    }, {
        label: 'H4',
        style: 'header-four'
    }, {
        label: 'H5',
        style: 'header-five'
    }, {
        label: 'H6',
        style: 'header-six'
    }, {
        label: 'Blockquote',
        style: 'blockquote'
    }, {
        label: 'UL',
        style: 'unordered-list-item'
    }, {
        label: 'OL',
        style: 'ordered-list-item'
    }
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    return (
        <div className="editor-blockStyleControls">
            {BLOCK_TYPES.map(
                (type) => <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

export default MyEditor;
