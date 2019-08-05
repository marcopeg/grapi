/* eslint-disable */

import React from 'react'
import Editor from 'components/Editor'
import ScrollToBottom from 'components/ScrollToBottom'

class JournalWrite extends React.Component {
    constructor (props) {
        super(props)
        this.editor = React.createRef()
        this.state = {
            journal: null,
            lastSaved: null,
            words: 0,
        }
    }

    async componentDidMount () {
        const journal = await this.props.fetchJournal(this.props.match.params.day)
        if (journal) {
            this.countWords(journal.content)
            this.setState({ journal, lastSaved: journal.updatedAt })
            this.startAutosave()
        }
    }

    save = async () => {
        if (!this.editor.current) {
            return
        }

        const day = this.state.journal.day
        const content = this.editor.current.getContent()
        const entry = await this.props.saveJournal(day, content)
        entry && this.setState({ lastSaved: new Date(entry.updatedAt) })
    }

    startAutosave = () => {
        this.__autosave = setInterval(this.save, 5000)
    }

    stopAutosave = () => {
        clearInterval(this.__autosave)
    }

    countWords = (content) => {
        const words = content ? content.reduce((acc, curr) => (acc + curr.text.split(' ').length), 0) : 0
        this.setState({ words })
    }

    onChange = (content) => {
        this.countWords(content)
        clearTimeout(this.__saveOnChange)
        this.__saveOnChange = setTimeout(this.save, 500)
    }

    render () {
        const { journal, lastSaved } = this.state
        if (!journal) {
            return (
                <div>loading...</div>
            )
        }

        return (
            <div style={{
                margin: '50px auto',
                maxWidth: '800px',
            }}>
                <h2>What makes you feel good?</h2>
                <div style={{ border: '1px solid #ddd', padding: 10 }}>
                    <Editor
                        ref={this.editor}
                        value={journal.content}
                        onChange={this.onChange}
                        inputStyle={{
                            width: '100%',
                            border: '0px solid #fff',
                            outline: 'none',
                            fontFamily: 'Verdana',
                            fontSize: '14pt',
                            margin: '5px 0',
                        }}
                    />
                </div>
                <hr />
                <small><b>{this.state.words} words</b> :: last saved: {lastSaved.toISOString()}</small><br />
                <ScrollToBottom />
            </div>
        )
    }
}

export default JournalWrite
