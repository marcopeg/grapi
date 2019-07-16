/* eslint-disable */
import React from 'react'
import Editor from 'components/Editor'

class JournalWrite extends React.Component {
    render () {
        return (
            <Editor />
        )
    }
}

// import uuid from 'uuid/v4'
// import TextareaAutosize from 'react-textarea-autosize'

// class JournalWrite extends React.Component {
//     constructor (props) {
//         super(props)

//         this.state = {
//             partsMap: {},
//             partsList: [],
//         }
//     }

//     addPart = (text = '') => new Promise((resolve) => {
//         const part = {
//             id: uuid(),
//             ref: React.createRef(),
//             createdAt: new Date(),
//             text,
//         }

//         this.setState({
//             partsMap: {
//                 ...this.state.partsMap,
//                 [part.id]: part,
//             },
//             partsList: [
//                 ...this.state.partsList,
//                 part.id,
//             ]
//         })

//         this.focusPart(part.id, -1)
//         setTimeout(resolve)
//     })

//     editPart = (partId, text) => {
//         this.setState({
//             partsMap: {
//                 ...this.state.partsMap,
//                 [partId]: {
//                     ...this.state.partsMap[partId],
//                     text,
//                 }
//             }
//         })
//     }

//     focusPart = (partId, cursorPos = 0) => {
//         clearTimeout(this.focusTimer)
//         this.focusTimer = setTimeout(() => {
//             const part = this.state.partsMap[partId]
//             console.log(part.ref.current.refs)
//             part.ref.current && part.ref.current.focus()

//             // cursor at the end
//             if (cursorPos === -1) {
//                 part.ref.current && (part.ref.current.selectionStart = part.text.length)
//             }
//         }, 50)
//     }

//     deletePart = (partId) => {
//         // get next item to focus on
//         const partIdx = this.state.partsList.indexOf(partId)
//         const nextPart = this.state.partsList[partIdx + 1] || this.state.partsList[partIdx - 1]

//         // remove item from the list
//         const partsList = this.state.partsList.filter(id => id !== partId)
//         const partsMap = { ...this.state.partsMap }
//         delete(partsMap[partId])

//         this.setState({
//             partsMap,
//             partsList,
//         })

//         // set the focus
//         this.focusPart(nextPart)
//     }

//     keyEvent = (partId, evt) => {
//         const part = this.state.partsMap[partId]

//         if (evt.keyCode === 13) {
//             evt.preventDefault()
//             evt.stopPropagation()

//             if (part.text.length > 0) {
//                 this.addPart()
//             }
//         }

//         if (evt.keyCode === 8 && part.text.length === 0 && this.state.partsList.length > 1) {
//             this.deletePart(part.id)
//         }

//         // arrow left // up
//         if ((evt.keyCode === 37 || evt.keyCode === 38) && part.ref.current.selectionStart === 0) {
//             const partIdx = this.state.partsList.indexOf(part.id)
//             const prevPart = this.state.partsList[partIdx - 1]
//             prevPart && this.focusPart(prevPart, -1)
//         }
        
//         // arrow right // down
//         if ((evt.keyCode === 39 || evt.keyCode === 40) && part.ref.current.selectionStart === part.text.length) {
//             const partIdx = this.state.partsList.indexOf(part.id)
//             const nextPart = this.state.partsList[partIdx + 1]
//             nextPart && this.focusPart(nextPart)
//         }

//         // console.log(evt.keyCode)
//     }

//     async componentDidMount () {
//         if (!this.state.partsList.length) {
//             await this.addPart('foo')
//             await this.addPart('faa')
//         }
//     }

//     render () {
//         return (
//             <div>
//                 JournalWrite

//                 {this.state.partsList.map(partId => {
//                     const part = this.state.partsMap[partId]

//                     return (
//                         <div key={part.id}>
//                             <TextareaAutosize
//                                 inputRef={part.ref}
//                                 value={part.text}
//                                 onKeyDown={evt => this.keyEvent(part.id, evt)}
//                                 onChange={evt => this.editPart(part.id, evt.target.value)}
//                                 style={{
//                                     border: '0px solid #fff',
//                                     outline: 'none',
//                                     width: '90%',
//                                     marginTop: 5,
//                                     marginBottom: 5,
//                                 }}
//                             />
//                         </div>
//                     )
//                 })}

//             </div>
//         )
//     }
// }

export default JournalWrite
