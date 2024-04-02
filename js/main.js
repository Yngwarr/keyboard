// TODO imports go here

const SVG_NS = 'http://www.w3.org/2000/svg';

function sliceToChar(str, from, to) {
    const indices = to.map(s => str.indexOf(s)).filter(i => i > -1);
    return str.slice(from, Math.min(...indices));
}

// e.g.: mkElem('svg#grid', {attr: { width: 8, height: 8 }}, SVG_NS)
function mkElem(sel, params = { attr: {}, data: {}, style: {} }, ns = null) {
    const tag = sel[0] === '#' || sel[0] === '.'
        ? 'div'
        : sliceToChar(sel, 0, ['#', '.']);
    const id = sel.includes('#')
        ? sliceToChar(sel, sel.indexOf('#') + 1, ['.'])
        : null;
    const class_list = sel.includes('.')
        ? sel.slice(sel.indexOf('.') + 1).split('.')
        : null;
    const { attr, data, style } = params;

    let el = ns
        ? document.createElementNS(ns, tag)
        : document.createElement(tag);

    if (id) {
        el.setAttribute('id', id);
    }
    if (class_list) {
        el.classList.add(...class_list);
    }
    for (const a in attr) {
        el.setAttribute(a, attr[a]);
    }
    for (const d in data) {
        el.dataset[d] = data[d];
    }
    for (const s in style) {
        el.style[s] = style[s];
    }

    return el;
}

function svgElem(sel, params) {
    return mkElem(sel, params, SVG_NS);
}

const ctx = {
    color: 'key'
};

const whiteWidth = 50;
const blackWidth = whiteWidth / 2;

function highlight(event) {
    event.target.classList.toggle(`${ctx.color}-colored`);
}

function whiteKey(x, y) {
    const rect = svgElem('rect.white-key.key', {
        attr: {
            x, y,
            width: whiteWidth,
            height: 300,
        }
    });

    rect.addEventListener('click', highlight);
    return rect;
}

function blackKey(x, y) {
    const rect = svgElem('rect.black-key.key', {
        attr: {
            x, y,
            width: blackWidth,
            height: 200,
        }
    });

    rect.addEventListener('click', highlight);
    return rect;
}

function keyboard() {
    const svg = svgElem('svg#kbd', {attr: { width: 800, height: 600 }});
    const xOffset = 20;
    const yOffset = 20;

    for (let i = 0; i < 15; ++i) {
        svg.appendChild(whiteKey(xOffset + i * whiteWidth, yOffset));
    }

    for (const pos of [0, 1, 3, 4, 5, 7, 8, 10, 11, 12]) {
        svg.appendChild(blackKey(xOffset + blackWidth * (pos * 2 + 1.5), yOffset));
    }

    return svg;
}

function setActiveColor(color) {
    const keyToggle = document.getElementById('key-toggle');
    const chordToggle = document.getElementById('chord-toggle');

    ctx.color = color;
    if (color === 'key') {
        keyToggle.classList.add('active');
        chordToggle.classList.remove('active');
    } else if (color === 'chord') {
        keyToggle.classList.remove('active');
        chordToggle.classList.add('active');
    }
}

function initControls() {
    const keyToggle = document.getElementById('key-toggle');
    const chordToggle = document.getElementById('chord-toggle');
    const keyDrop = document.getElementById('key-drop');
    const chordDrop = document.getElementById('chord-drop');

    keyToggle.addEventListener('click', () => {
        setActiveColor('key');
    });

    chordToggle.addEventListener('click', () => {
        setActiveColor('chord');
    });

    keyDrop.addEventListener('click', () => {
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('key-colored');
        });
    });

    chordDrop.addEventListener('click', () => {
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('chord-colored');
        });
    });

    setActiveColor(ctx.color);
}

function init() {
    document.querySelector('main').appendChild(keyboard());

    initControls();
}

init();
