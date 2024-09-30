import { ImageLike, createWorker } from "../node_modules/tesseract.js";

export default async function converter(img: ImageLike) {
  const worker = await createWorker("eng", 1, {
    workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js",
  });
  const ret = await worker.recognize(img);
  await worker.terminate();
  return ret.data.text;
}
