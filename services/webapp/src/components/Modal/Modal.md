
#### Fade

```js
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
        Hello World - Fade!
    </Modal>
</div>
```

#### SlideLeft

```js
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
        useBackdrop={true}
        onRequestHide={() => setState({ isVisible: false })}
    >
        Hello World - SlideLeft!
    </Modal>
</div>
```

#### SlideUp

```js
initialState = { isVisible: false };
<div>
    <button onClick={() => setState({ isVisible: !state.isVisible })}>
        Toggle Modal
        {state.isVisible ? ' - visible' : null}
    </button>
    <Modal
        isVisible={state.isVisible}
        animation={'slideUp'}
        useBackdrop={true}
        onRequestHide={() => setState({ isVisible: false })}
    >
        Hello World - SlideUp!
    </Modal>
</div>
```
