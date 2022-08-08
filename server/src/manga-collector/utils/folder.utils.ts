import http from "https";
import fs from "fs";
import path from "path";

export async function createLocalImage(imageUrl: string, dir: string, name = "cover.png"): Promise<void> {
  http.get(imageUrl, res => {
    const stream = fs.createWriteStream(path.join(dir, name));
    res.pipe(stream);
    stream.on('finish', () => {
        stream.close();
    })
  });
}