export async function uploadToServer(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() * 10 > 7) {
        reject(new Error("Upload Failed !"));
      } else {
        resolve(URL.createObjectURL(file));
      }
    }, 5000);
  });
}
