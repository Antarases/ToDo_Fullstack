export function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    }
    else {
        console.log('An error occurred.', response);
    }
}

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export async function getCompressedBase64Image(file, imageWidth = 320) {
    return new Promise(async (resolve, reject) => {
        try {
            const fileName = file.name;
            const imageBase64 = await getBase64(file);

            const img = new Image();
            img.onload = () => {
                const width = imageWidth;
                const scaleFactor = width / img.width;
                const height = img.height * scaleFactor;

                const canvasElement = document.createElement('canvas');
                canvasElement.width = width;
                canvasElement.height = height;
                const canvasContext = canvasElement.getContext('2d');
                canvasContext.drawImage(img, 0, 0, width, height);
                canvasContext.canvas.toBlob(async (blob) => {
                    const file = new File([blob], fileName, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });

                    resolve(await getBase64(file));
                }, 'image/jpeg', 1);
            };
            img.src = imageBase64;
        } catch (error) {
            reject(`Error happen during compressing image. ${error}`);
        }
    });
}

export function smoothScrollUp() {
    if ((document.body.scrollTop > 0) || (document.documentElement.scrollTop > 0)) {
        window.scrollBy(0,-50);
        setTimeout(smoothScrollUp, 10);
    }
}
