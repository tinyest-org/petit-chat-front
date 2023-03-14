export function generateColor() {
    const c = HSVtoRGB(Math.random(), 1.0, 1.0);
    c.r *= 0.15;
    c.g *= 0.15;
    c.b *= 0.15;
    return c;
}

// @ts-ignore
export function HSVtoRGB(h: number, s: number, v: number): { r: number, g: number, b: number } {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            return { r: v, g: t, b: p, }
        case 1:
            return { r: q, g: v, b: p, }
        case 2:
            return { r: p, g: v, b: t, }
        case 3:
            return { r: p, g: q, b: v, }
        case 4:
            return { r: t, g: p, b: v, }
        case 5:
            return { r: v, g: p, b: q, }
    }
}


export function normalizeColor(input: { r: number; g: number; b: number; }) {
    return {
        r: input.r / 255,
        g: input.g / 255,
        b: input.b / 255
    };
}

export function wrap(value: number, min: number, max: number) {
    const range = max - min;
    if (range == 0) {
        return min;
    }
    return (value - min) % range + min;
}

export function hashCode(s: string) {
    if (s.length == 0) return 0;
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function addKeywords(source: string, keywords?: string[] | null) {
    if (keywords === null || keywords === undefined) {
        return source;
    }
    let keywordsString = '';
    keywords.forEach(keyword => {
        keywordsString += '#define ' + keyword + '\n';
    });
    return keywordsString + source;
}

export const makeShaderCompiler = (gl: WebGLRenderingContext) => (type: any, source: string, keywords?: string[] | null) => compileShader(gl, type, source, keywords)

export function compileShader(gl: WebGLRenderingContext, type: any, source: string, keywords?: string[] | null) {
    source = addKeywords(source, keywords);

    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.trace(gl.getShaderInfoLog(shader));
    }
    return shader;
};


export function resizeCanvas(canvas: HTMLCanvasElement) {
    let width = scaleByPixelRatio(canvas.clientWidth);
    let height = scaleByPixelRatio(canvas.clientHeight);
    if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

export function correctDeltaX(canvas: HTMLCanvasElement, delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) {
        delta *= aspectRatio;
    }
    return delta;
}

export function correctDeltaY(canvas: HTMLCanvasElement, delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) {
        delta /= aspectRatio;
    }
    return delta;
}



export function getTextureScale(texture: { width: number; height: number; attach?: (id: any) => any; }, width: number, height: number) {
    return {
        x: width / texture.width,
        y: height / texture.height
    };
}

export function scaleByPixelRatio(input: number) {
    let pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
}

export function getResolution(gl: WebGLRenderingContext, resolution: number) {
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspectRatio < 1) {
        aspectRatio = 1.0 / aspectRatio;
    }

    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);

    if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
        return { width: max, height: min };
    } else {
        return { width: min, height: max };
    }
}
