import { z, page } from './2ombular';
import { register } from './page';

//let ctx;

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const hertzes = [16.35];
const noteFactor = Math.pow(2, 1/12);
for (let i = 0; i < 95; i++) hertzes.push(hertzes[i]*noteFactor);

const note2pitch = name => hertzes[Number(name[name.length-1])*12 + notes.indexOf(name.slice(0, name.length-1))];

const melody = 'DDFFDDAAAFGGGEGGGFED'.split('').map(i => [i+4, note2pitch(i+4)]);
let i = 0;

export const start = _ => navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    const scriptProcessor = audioContext.createScriptProcessor();
    const frequencies = new Uint8Array(analyser.fftSize);

    const input = audioContext.createMediaStreamSource(stream);
    input.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    const rate = audioContext.sampleRate / analyser.fftSize;

    let counter = 0;
    scriptProcessor.onaudioprocess = e => {
        analyser.getByteFrequencyData(frequencies);
        let a = frequencies[Math.floor(melody[i][1]/rate)] > 210;
        if (a) counter++;
        if (counter > 5) {
            counter = 0;
            i = (i + 1) % melody.length;
            page.update();
        }
        //console.log(frequencies[Math.floor(440/rate)] > 220);
        /*ctx.clearRect(0, 0, 1024, 512);
        ctx.beginPath();
        ctx.moveTo(0, f);
        ctx.strokeStyle='#000000';
        for(let i = 0; i < frequencies.length; i++) {
            ctx.lineTo(i, 256-frequencies[i];);
        }
        ctx.stroke();*/
    }
});

register('', _ => [
    z._button({ onclick: start }, 'click'),
    _ => z({style: 'display: flex'}, melody.map(([n, _], j) => z({style: 'margin-left:5px'}, z({style: j === i ? 'color: green' : ''}, n))))
]);
