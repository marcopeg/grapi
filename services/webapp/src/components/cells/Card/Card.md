#### Text Only

```js
<div style={{ width: 300, height: 50, border: '1px dashed #ddd' }}>
    <Card>card with text</Card>
</div>
```

#### Generic Components

```js
<div style={{ width: 300, height: 50, border: '1px dashed #ddd' }}>
    <Card style={{ background: 'fuchsia' }}>
        <h4>a title</h4>
        <p>a paragraph</p>
    </Card>
</div>
```

#### Complete Card

```js
<div style={{ width: 300, height: 70, border: '1px dashed #ddd' }}>
    <Card>
        <Card.Header style={{ background: 'yellow' }}>
            Header
        </Card.Header>
        <Card.Body style={{ background: '#ffaa77' }}>
            Body
        </Card.Body>
        <Card.Footer style={{ background: 'green' }}>
            Footer
        </Card.Footer>
    </Card>
</div>
```

#### Header Only

```js
<div style={{ width: 300, height: 70, border: '1px dashed #ddd' }}>
    <Card>
        <Card.Header style={{ background: 'yellow' }}>
            Header
        </Card.Header>
        <Card.Body style={{ background: '#ffaa77' }}>
            Body
        </Card.Body>
    </Card>
</div>
```

#### Footer Only

```js
<div style={{ width: 300, height: 70, border: '1px dashed #ddd' }}>
    <Card>
        <Card.Footer style={{ background: 'green' }}>
            Footer
        </Card.Footer>
        <Card.Body style={{ background: '#ffaa77' }}>
            Body
        </Card.Body>
    </Card>
</div>
```

#### Scrollable Body

```js
<div style={{ width: 300, height: 100, border: '1px dashed #ddd' }}>
    <Card>
        <Card.Header style={{ background: 'yellow' }}>
            Header
        </Card.Header>
        <Card.Body scrollable style={{ background: '#ffaa77' }}>
            {Array.apply(null, {length: 45}).map((_, i) => <div key={`ex1${i}`}>line {i}</div>)}
        </Card.Body>
        <Card.Footer style={{ background: 'green' }}>
            Footer
        </Card.Footer>
    </Card>
</div>
```
