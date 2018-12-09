import React from 'react';
import { EditorState, RichUtils} from 'draft-js';
import Editor from "draft-js-plugins-editor";
import createHighlightPlugin from './plugins/highlightPlugin';
import addLinkPlugin from './plugins/addLinkPlugin';
import BlockStyleToolbar, { getBlockStyle } from "./blockStyles/BlockStyleToolbar";

const highlightPlugin = createHighlightPlugin();

class PageContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state =  {
            editorState: EditorState.createEmpty(),
        };
        
        this.plugins = [
            highlightPlugin,
            addLinkPlugin,
        ];
    }

    onChange = (editorState) => {
        this.setState({
            editorState
        })
    }

    handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    onItalicClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'))
    }
    
    onBoldClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
    }

    onUndelineClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'))
    }

    onHighlight = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT'))
    }

    onAddLink = () => {
        const editorState = this.state.editorState;
        const selection = editorState.getSelection();
        const link = window.prompt('Paste link here:');

        if (!link) {
            this.onChange(RichUtils.toggleLink(editorState, selection, null));
            return 'handled';
          }
        const content = editorState.getCurrentContent();
        const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: link });
        const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
        const entityKey = contentWithEntity.getLastCreatedEntityKey();
        this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey))
    }

    toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    };

    render() {
        return (
            <div className="editorContainer">
                <div class="toolbar">
                    <BlockStyleToolbar
                        editorState={this.state.editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <button onClick={this.onItalicClick}>
                        <em>I</em>
                    </button>
                    <button onClick={this.onBoldClick}>
                        <b>B</b>
                    </button>
                    <button onClick={this.onUndelineClick}>
                        U
                    </button>
                    <button className="highlight" onClick={this.onHighlight}>
                        <span style={{ background:"yellow" }}>H</span>
                    </button>
                    <button id="link_url" className="add-link" onClick={this.onAddLink}>
                        <i className="material-icons">attach_file</i>
                    </button>
                </div>
                <div className="editors">
                <Editor
                    editorState={this.state.editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    plugins={this.plugins}
                    blockStyleFn={getBlockStyle}
                />
                </div>
            </div>
        )
    }
}

export default PageContainer;