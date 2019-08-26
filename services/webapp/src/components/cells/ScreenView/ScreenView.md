Full Screen:

```js
initialState = { isVisible: false };
<div>
    {state.isVisible ? null : (
        <button
            onClick={() => setState({ isVisible: true })}
            children={'Open ScreenView'}
        />
    )}
    {state.isVisible ? (
        <ScreenView
            centered
            style={{ background: '#afafaf', border: '2px solid yellow' }}
        >
            <h1>Full Screen View</h1>
            <button
                onClick={() => setState({ isVisible: false })}
                children={'Close ScreenView'}
            />
        </ScreenView>
    ) : null}
</div>
```

With Sizes:

```js
initialState = { isVisible: false };
<div>
    {state.isVisible ? null : (
        <button
            onClick={() => setState({ isVisible: true })}
            children={'Open ScreenView'}
        />
    )}
    {state.isVisible ? (
        <ScreenView
            centered
            width={90}
            height={80}
            style={{ background: '#afafaf', border: '2px solid yellow' }}
        >
            <h1>Sized Screen View</h1>
            <button
                onClick={() => setState({ isVisible: false })}
                children={'Close ScreenView'}
            />
        </ScreenView>
    ) : null}
</div>
```

With Margins:

```js
initialState = { isVisible: false };
<div>
    {state.isVisible ? null : (
        <button
            onClick={() => setState({ isVisible: true })}
            children={'Open ScreenView'}
        />
    )}
    {state.isVisible ? (
        <ScreenView
            centered
            marginTop={10}
            marginRight={20}
            marginBottom={40}
            marginLeft={40}
            style={{ background: '#afafaf', border: '2px solid yellow' }}
        >
            <h1>Sized Screen View</h1>
            <button
                onClick={() => setState({ isVisible: false })}
                children={'Close ScreenView'}
            />
        </ScreenView>
    ) : null}
</div>
```
