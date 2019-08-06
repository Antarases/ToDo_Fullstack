var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
];

function imageValidation(validatedFields, imageValidationNode) {
    const files = validatedFields.files;
    if(files.length === 0) {
        imageValidationNode.textContent = 'File is not selected';
    } else {
        for(var i = 0; i < files.length; i++) {
            if(!validFileType(files[i])) {
                validatedFields.value = null;
                imageValidationNode.textContent = 'Not a valid file type';
            }
            else {
                imageValidationNode.textContent = '';
            }
        }
    }
}

function validFileType(file) {
    for(var i = 0; i < fileTypes.length; i++) {
        if(file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
};

export default imageValidation;
