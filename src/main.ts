import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import * as Scene from './globe-scene';

const canvas = document.querySelector<HTMLCanvasElement>('.canvas');

if (canvas)
  Scene.createScene(canvas);


