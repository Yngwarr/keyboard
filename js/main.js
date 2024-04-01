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

const whiteWidth = 50;
const blackWidth = whiteWidth / 2;

function highlight(event) {
    event.target.classList.toggle('highlighted');
}

function whiteKey(x, y) {
    const rect = svgElem('rect.white-key', {
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
    const rect = svgElem('rect.black-key', {
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
    const xOffset = 10;
    const yOffset = 10;

    for (let i = 0; i < 15; ++i) {
        svg.appendChild(whiteKey(xOffset + i * whiteWidth, yOffset));
    }

    for (const pos of [0, 1, 3, 4, 5, 7, 8, 10, 11, 12]) {
        svg.appendChild(blackKey(xOffset + blackWidth * (pos * 2 + 1.5), yOffset));
    }

    return svg;
}

function init() {
    document.querySelector('main').appendChild(keyboard());
}

init();
