### Default Props

```js
<div style={{ width: 300, height: 40, border: '1px dashed #ddd' }}>
    <View style={{ background: 'yellow' }}>default block view</View>
</div>
```

### Centered

```js
<div style={{ width: 300, height: 100, border: '1px dashed #ddd' }}>
    <View centered style={{ background: 'yellow' }}>
        <p style={{ width: 200, textAlign: 'center' }}>
            default block view with centered content<br />(flexbox only)
        </p>
    </View>
</div>
```

### Vertical

```js
<div style={{ width: 300, height: 50, border: '1px dashed #ddd' }}>
    <View vertical>
        <div>col1</div>
        <div>col2</div>
    </View>
</div>
```

### Nested Blocks

```js
<div style={{ width: 300, height: 100, border: '1px dashed #ddd' }}>
    <View style={{ background: 'yellow' }}>
        <View
            mask
            vertical
            spaced
            style={{ flex: 0.3, background: 'fuchsia' }}
        >
            <View inline>inline1</View>
            <View inline>inline2</View>
        </View>
        <View centered>centered box</View>
    </View>
</div>
```

### Scrollable Content

```js
<div style={{ width: 300, height: 70, border: '1px dashed #ddd' }}>
    <View scrollable>
        {Array.apply(null, {length: 45}).map((_, i) => <div key={`ex1${i}`}>line {i}</div>)}
    </View>
</div>
```

### Masked Content

```js
<div style={{ width: 300, height: 70, border: '1px dashed #ddd' }}>
    <View mask>
        {Array.apply(null, {length: 45}).map((_, i) => <div key={`ex1${i}`}>line {i}</div>)}
    </View>
</div>
```

### Inline

```js
<div style={{ width: 300, height: 40, border: '1px dashed #ddd' }}>
    <View inline style={{ background: 'fuchsia' }}>inline view1</View>
    <View inline style={{ background: 'lime' }}>inline view2</View>
</div>
```
