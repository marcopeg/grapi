/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import Editor from 'components/Editor'
import { fetchJournal, saveJournal } from './journal.service'

class JournalWrite extends React.Component {
    constructor (props) {
        super(props)
        this.editor = React.createRef()
        this.state = {
            entry: null,
            lastSaved: null,
        }
    }

    async componentDidMount () {
        const entry = await this.props.dispatch(fetchJournal())
        this.setState({ entry, lastSaved: entry.updatedAt })
        this.startAutosave()
    }

    startAutosave = () => {
        this.__autosave = setInterval(this.save, 5000)
    }

    stopAutosave = () => {
        clearInterval(this.__autosave)
    }

    save = async () => {
        if (!this.editor.current) {
            return
        }

        const day = this.state.entry.day
        const content = this.editor.current.getContent()
        const entry = await this.props.dispatch(saveJournal(day, content))
        this.setState({ lastSaved: new Date(entry.updatedAt) })
    }

    onChange = (content) => {
        clearTimeout(this.__saveOnChange)
        this.__saveOnChange = setTimeout(this.save, 500)
    }

    render () {
        const { entry, lastSaved } = this.state
        if (!entry) {
            return (
                <span>loading...</span>
            )
        }
        return (
            <div style={{
                margin: '50px auto',
                maxWidth: '800px',
            }}>
                <Editor
                    ref={this.editor}
                    value={entry.content}
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
                <hr />
                <small>(last saved: {lastSaved.toISOString()})</small>
            </div>
        )
    }
}

export default connect()(JournalWrite)
