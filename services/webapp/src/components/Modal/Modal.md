
#### Fade

```js
const ScreenView = require('components/cells/ScreenView').default
initialState = { isVisible: false };
<div>
    <button onClick={() => setState({ isVisible: !state.isVisible })}>
        Toggle Modal
        {state.isVisible ? ' - visible' : null}
    </button>
    <Modal
        isVisible={state.isVisible}
        useBackdrop={true}
        onRequestHide={() => setState({ isVisible: false })}
    >
        <ScreenView
            centered
            width={90}
            height={90}
            marginBottom={50}
            style={{ background: 'red' }}
        >
            Hello World - Fade!
            <button onClick={() => setState({ isVisible: false })}>
                close
            </button>
        </ScreenView>
    </Modal>
</div>
```

#### SlideLeft

```js
const ScreenView = require('components/cells/ScreenView').default
initialState = { isVisible: false }
;
<div>
    <button onClick={() => setState({ isVisible: !state.isVisible })}>
        Toggle Modal
        {state.isVisible ? ' - visible' : null}
    </button>
    <Modal
        isVisible={state.isVisible}
        animation={'slideLeft'}
        useGestures={true}
        onRequestHide={() => setState({ isVisible: false })}
    >
        <ScreenView centered style={{ backgroundColor: 'rgba(200, 200, 200, 0.5)' }}>
            <h3>Hello World - SlideLeft!</h3>
            <p>(swipe right to close)</p>
        </ScreenView>
    </Modal>
</div>
```

#### SlideUp

```js
const ScreenView = require('components/cells/ScreenView').default
initialState = { isVisible: false };
<div>
    <button onClick={() => setState({ isVisible: !state.isVisible })}>
        Toggle Modal
        {state.isVisible ? ' - visible' : null}
    </button>
    <Modal
        isVisible={state.isVisible}
        animation={'slideUp'}
        useGestures={true}
        onRequestHide={() => setState({ isVisible: false })}
    >
        <ScreenView centered style={{ backgroundColor: 'rgba(200, 200, 200, 0.5)' }}>
            <h3>Hello World - SlideUp!</h3>
            <p>(swipe down to close)</p>
        </ScreenView>
    </Modal>
</div>
```
